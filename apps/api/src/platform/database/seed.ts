import 'dotenv/config';
import { resolve } from 'node:path';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { platforms } from './schema';

config({ path: resolve(process.cwd(), '../../.env') });

if (process.env.NODE_ENV === 'production')
  throw new Error('Development seed data cannot run in production.');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl)
  throw new Error(
    'DATABASE_URL is required to seed local development data. Copy .env.example to .env.',
  );

const examples = [
  { slug: 'upwork-example-draft', name: 'Upwork' },
  { slug: 'fiverr-example-draft', name: 'Fiverr' },
  { slug: 'khamsat-example-draft', name: 'خمسات' },
] as const;
// Identity has no Account table yet; this reserved development actor UUID is
// only used by unpublished drafts and must never be treated as a real account.
const developmentActorId = '00000000-0000-4000-8000-000000000001';

async function seed(): Promise<void> {
  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool);
  try {
    await db
      .insert(platforms)
      .values(
        examples.map((example) => ({
          ...example,
          lifecycle: 'draft' as const,
          availabilityState: 'not_yet_confirmed' as const,
          createdBy: developmentActorId,
        })),
      )
      .onConflictDoNothing({ target: platforms.slug });
    process.stdout.write(
      `Ensured ${examples.length} unpublished platform draft examples.\n`,
    );
  } finally {
    await pool.end();
  }
}

void seed().catch((error: unknown) => {
  process.stderr.write(
    `${error instanceof Error ? error.message : 'Database seeding failed.'}\n`,
  );
  process.exitCode = 1;
});
