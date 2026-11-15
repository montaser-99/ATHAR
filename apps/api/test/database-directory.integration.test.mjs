import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const testDatabaseUrl = process.env.ATHAR_TEST_DATABASE_URL;
const configuredApplicationDatabaseUrl = process.env.DATABASE_URL;
const testDirectory = dirname(fileURLToPath(import.meta.url));
const repositoryDirectory = resolve(testDirectory, '../../..');

process.env.NODE_ENV ??= 'test';
process.env.DATABASE_URL ??=
  testDatabaseUrl ??
  'postgresql://athar:athar_local_only@127.0.0.1:5432/athar_test';
process.env.MAIL_HOST ??= '127.0.0.1';
process.env.MAIL_PORT ??= '1025';

test('database query failures become a generic API error without leaking details', async () => {
  await import('reflect-metadata');
  const [{ DirectoryExceptionFilter }, { PlatformReadService }] =
    await Promise.all([
      import('../dist/modules/directory/directory-exception.filter.js'),
      import('../dist/modules/platforms/platform-read.service.js'),
    ]);
  const databaseFailure = new Error('connection detail must not reach clients');
  const service = new PlatformReadService({
    select() {
      throw databaseFailure;
    },
  });

  await assert.rejects(
    () => service.list({ page: 1, pageSize: 20 }),
    databaseFailure,
  );

  const response = {
    statusCode: 0,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
    },
  };
  const host = {
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => ({ path: '/api/v1/platforms' }),
    }),
  };

  new DirectoryExceptionFilter().catch(databaseFailure, host);
  assert.equal(response.statusCode, 500);
  assert.deepEqual(response.body, {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'تعذر إكمال الطلب الآن.',
    },
    path: '/api/v1/platforms',
  });
  assert.equal(
    JSON.stringify(response.body).includes('connection detail'),
    false,
  );
});

test('migration journal is ordered and every referenced SQL migration exists', async () => {
  const journalPath = resolve(
    repositoryDirectory,
    'db/migrations/meta/_journal.json',
  );
  const journal = JSON.parse(await readFile(journalPath, 'utf8'));
  assert.ok(journal.entries.length > 0);
  assert.deepEqual(
    journal.entries.map(({ idx }) => idx),
    journal.entries.map((_, index) => index),
  );
  for (const entry of journal.entries) {
    const migrationPath = resolve(
      repositoryDirectory,
      'db/migrations',
      `${entry.tag}.sql`,
    );
    await readFile(migrationPath, 'utf8');
  }
});

test('development seed is restricted to development and inserts unpublished drafts', async () => {
  const seedSource = await readFile(
    resolve(repositoryDirectory, 'apps/api/src/platform/database/seed.ts'),
    'utf8',
  );
  assert.match(seedSource, /NODE_ENV !== 'development'/);
  assert.match(
    seedSource,
    /Development seed data can only run against local PostgreSQL/,
  );
  assert.match(seedSource, /lifecycle: 'draft'/);
  assert.match(
    seedSource,
    /onConflictDoNothing\(\{ target: platforms\.slug \}\)/,
  );
});

test(
  'PostgreSQL directory integration: listing, search, filters, pagination, visibility, details, and errors',
  {
    skip:
      !testDatabaseUrl &&
      'Set ATHAR_TEST_DATABASE_URL to a migrated disposable *_test database.',
  },
  async (t) => {
    const target = new URL(testDatabaseUrl);
    const databaseName = decodeURIComponent(target.pathname.replace(/^\//, ''));
    assert.match(
      databaseName,
      /(?:^|[_-])test$/i,
      'test database name must end in test',
    );

    if (configuredApplicationDatabaseUrl) {
      const configured = new URL(configuredApplicationDatabaseUrl);
      assert.notEqual(
        `${target.host}${target.pathname}`,
        `${configured.host}${configured.pathname}`,
        'test database must not be the configured development/production database',
      );
    }

    const { Pool } = await import('pg');
    const { drizzle } = await import('drizzle-orm/node-postgres');
    const { sql } = await import('drizzle-orm');
    const { schema } = await import('../dist/platform/database/schema.js');
    const { PlatformReadService } =
      await import('../dist/modules/platforms/platform-read.service.js');
    const { DirectoryController } =
      await import('../dist/modules/directory/directory.controller.js');
    const pool = new Pool({
      connectionString: testDatabaseUrl,
      connectionTimeoutMillis: 3_000,
      max: 2,
    });

    try {
      const migrationCount = JSON.parse(
        await readFile(
          resolve(repositoryDirectory, 'db/migrations/meta/_journal.json'),
          'utf8',
        ),
      ).entries.length;
      const migrationState = await pool.query(
        `select count(*)::int as count from public.__drizzle_migrations`,
      );
      assert.equal(
        migrationState.rows[0].count,
        migrationCount,
        'apply all repository migrations to this disposable database first',
      );
      const deletionGuard = await pool.query(
        `select exists (
          select 1 from pg_trigger
          where tgname = 'platforms_prevent_delete' and not tgisinternal
        ) as present`,
      );
      assert.equal(
        deletionGuard.rows[0].present,
        true,
        'latest platform migration must be applied',
      );

      const fixtures = await prepareFixtures(pool);
      const db = drizzle({ client: pool, schema });
      const service = new PlatformReadService(db);
      const controller = new DirectoryController(service);
      const queryPrefix = 'athar-integration-';

      await t.test(
        'lists published records and excludes draft seed records',
        async () => {
          const result = await controller.list({
            q: queryPrefix,
            sort: 'newest',
          });
          const slugs = result.items.map(({ slug }) => slug);
          assert.deepEqual(new Set(slugs), new Set(fixtures.publishedSlugs));
          assert.equal(slugs.includes(fixtures.draftSlug), false);
        },
      );

      await t.test(
        'search excludes suspended records by default but an explicit state filter can include them',
        async () => {
          const defaultSearch = await controller.list({ q: queryPrefix });
          assert.equal(
            defaultSearch.items.some(
              ({ slug }) => slug === fixtures.suspendedSlug,
            ),
            false,
          );
          const explicitSearch = await controller.list({
            q: queryPrefix,
            availability: ['suspended_or_closed'],
          });
          assert.deepEqual(
            explicitSearch.items.map(({ slug }) => slug),
            [fixtures.suspendedSlug],
          );
        },
      );

      await t.test(
        'category and supported vocabulary filters combine across types',
        async () => {
          const result = await controller.list({
            q: queryPrefix,
            category: [fixtures.categorySlug],
            opportunityType: [fixtures.opportunitySlug],
            paymentMethod: [fixtures.paymentSlug],
            experienceLevel: [fixtures.experienceSlug],
          });
          assert.deepEqual(
            new Set(result.items.map(({ slug }) => slug)),
            new Set(fixtures.publishedSlugs),
          );
        },
      );

      await t.test(
        'pagination has stable totals and distinct pages',
        async () => {
          const first = await controller.list({
            q: queryPrefix,
            sort: 'newest',
            page: 1,
            pageSize: 1,
          });
          const second = await controller.list({
            q: queryPrefix,
            sort: 'newest',
            page: 2,
            pageSize: 1,
          });
          const third = await controller.list({
            q: queryPrefix,
            sort: 'newest',
            page: 3,
            pageSize: 1,
          });
          assert.equal(first.total, 3);
          assert.equal(first.pageCount, 3);
          assert.equal(second.total, first.total);
          assert.equal(third.total, first.total);
          assert.equal(
            new Set([first.items[0].id, second.items[0].id, third.items[0].id])
              .size,
            3,
          );
        },
      );

      await t.test(
        'details expose eligible verified facts and sources only',
        async () => {
          const details = await controller.details(fixtures.detailSlug);
          const fact = details.facts.find(
            ({ key }) => key === 'identity_overview',
          );
          assert.equal(fact?.verification.status, 'verified');
          assert.deepEqual(
            fact?.verification.sources.map(({ title }) => title),
            ['Integration fixture evidence'],
          );
        },
      );

      await t.test(
        'database errors reach the API filter as generic internal errors',
        async () => {
          const databaseFailure = await pool.query('select 1 / 0').then(
            () => null,
            (error) => error,
          );
          assert.ok(databaseFailure instanceof Error);
          const { DirectoryExceptionFilter } =
            await import('../dist/modules/directory/directory-exception.filter.js');
          const response = createResponse();
          const host = createHttpHost(response);
          new DirectoryExceptionFilter().catch(databaseFailure, host);
          assert.equal(response.statusCode, 500);
          assert.equal(response.body.error.code, 'INTERNAL_ERROR');
          assert.equal(
            JSON.stringify(response.body).includes(databaseFailure.message),
            false,
          );
          await assert.rejects(() => db.execute(sql`select 1 / 0`));
        },
      );
    } finally {
      await pool.end();
    }
  },
);

async function prepareFixtures(pool) {
  const actorId = '00000000-0000-4000-8000-000000000021';
  const reviewerId = '00000000-0000-4000-8000-000000000022';
  const categorySlug = 'athar-integration-category';
  const opportunitySlug = 'athar-integration-opportunity';
  const paymentSlug = 'athar-integration-payment';
  const experienceSlug = 'athar-integration-experience';
  const publishedSlugs = [
    'athar-integration-published-a',
    'athar-integration-published-b',
    'athar-integration-published-c',
  ];
  const suspendedSlug = 'athar-integration-suspended';
  const draftSlug = 'athar-integration-draft';
  const detailSlug = publishedSlugs[0];

  const valueIds = new Map();
  for (const [type, slug] of [
    ['category', categorySlug],
    ['opportunity_type', opportunitySlug],
    ['payment_method', paymentSlug],
    ['experience_level', experienceSlug],
  ]) {
    const result = await pool.query(
      `insert into vocabulary_values (type, slug, label_ar, label_latin, is_active)
       values ($1, $2, $3, $4, true)
       on conflict (type, slug) do update set is_active = true
       returning id`,
      [type, slug, `Fixture ${type}`, `Fixture ${type}`],
    );
    valueIds.set(slug, result.rows[0].id);
  }

  const platformIds = new Map();
  const records = [
    ...publishedSlugs.map((slug, index) => ({
      slug,
      name: `ATHAR Integration ${String.fromCharCode(65 + index)}`,
      lifecycle: 'published',
      availability: 'available',
      publishedAt: new Date(Date.UTC(2026, 0, index + 1)),
    })),
    {
      slug: suspendedSlug,
      name: 'ATHAR Integration Suspended',
      lifecycle: 'published',
      availability: 'suspended_or_closed',
      publishedAt: new Date(Date.UTC(2026, 0, 5)),
    },
    {
      slug: draftSlug,
      name: 'ATHAR Integration Draft Seed',
      lifecycle: 'draft',
      availability: 'not_yet_confirmed',
      publishedAt: null,
    },
  ];
  for (const record of records) {
    const result = await pool.query(
      `insert into platforms (slug, name, lifecycle, published_at, availability_state, created_by)
       values ($1, $2, $3, $4, $5, $6)
       on conflict (slug) do update set
         name = excluded.name,
         lifecycle = excluded.lifecycle,
         published_at = excluded.published_at,
         availability_state = excluded.availability_state
       returning id`,
      [
        record.slug,
        record.name,
        record.lifecycle,
        record.publishedAt,
        record.availability,
        actorId,
      ],
    );
    platformIds.set(record.slug, result.rows[0].id);
  }

  for (const slug of publishedSlugs) {
    for (const valueSlug of [
      categorySlug,
      opportunitySlug,
      paymentSlug,
      experienceSlug,
    ]) {
      await pool.query(
        `insert into platform_vocabulary_links (platform_id, vocabulary_value_id)
         values ($1, $2) on conflict do nothing`,
        [platformIds.get(slug), valueIds.get(valueSlug)],
      );
    }
  }

  const fact = await pool.query(
    `insert into fact_items (platform_id, fact_key, value_text, is_visible, last_edited_by)
     values ($1, 'identity_overview', 'Synthetic integration test fact', true, $2)
     on conflict (platform_id, fact_key) do update set
       value_text = excluded.value_text, is_visible = true, last_edited_by = excluded.last_edited_by
     returning id`,
    [platformIds.get(detailSlug), actorId],
  );
  await pool.query(
    `insert into verification_records (fact_item_id, status, last_verified_on, reviewer_account_id)
     values ($1, 'verified', '2026-01-05', $2)
     on conflict (fact_item_id) do update set
       status = 'verified', last_verified_on = excluded.last_verified_on,
       reviewer_account_id = excluded.reviewer_account_id`,
    [fact.rows[0].id, reviewerId],
  );
  await pool.query(
    `insert into sources (id, fact_item_id, type, title, url, accessed_on, added_by)
     values ('00000000-0000-4000-8000-000000000023', $1, 'platform_document',
       'Integration fixture evidence', 'https://example.invalid/athar-fixture', '2026-01-05', $2)
     on conflict (id) do update set fact_item_id = excluded.fact_item_id,
       type = excluded.type, title = excluded.title, url = excluded.url,
       accessed_on = excluded.accessed_on, added_by = excluded.added_by`,
    [fact.rows[0].id, actorId],
  );

  return {
    publishedSlugs,
    suspendedSlug,
    draftSlug,
    detailSlug,
    categorySlug,
    opportunitySlug,
    paymentSlug,
    experienceSlug,
  };
}

function createResponse() {
  return {
    statusCode: 0,
    body: undefined,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
    },
  };
}

function createHttpHost(response) {
  return {
    switchToHttp: () => ({
      getResponse: () => response,
      getRequest: () => ({ path: '/api/v1/platforms' }),
    }),
  };
}
