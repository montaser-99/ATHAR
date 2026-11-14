import { Inject, Injectable } from '@nestjs/common';
import {
  and,
  asc,
  desc,
  eq,
  exists,
  inArray,
  isNotNull,
  ne,
  or,
  sql,
  type SQLWrapper,
} from 'drizzle-orm';
import type { PlatformDirectoryQuery } from '@athar/contracts';
import {
  DATABASE,
  type AtharDatabase,
} from '../../platform/database/database.module';
import {
  factItems,
  factLinks,
  platforms,
  platformStatusHistory,
  platformVocabularyLinks,
  popularitySnapshots,
  sources,
  verificationRecords,
  vocabularyValues,
  warningCases,
} from '../../platform/database/schema';

const vocabularyTypes = [
  'category',
  'work_type',
  'opportunity_type',
  'experience_level',
  'payment_method',
] as const;
type VocabularyType = (typeof vocabularyTypes)[number];

const normalizeSearch = (value: string): string =>
  value
    .toLocaleLowerCase('ar-EG')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/[ى]/g, 'ي')
    .replace(/[ة]/g, 'ه')
    .replace(/[ک]/g, 'ك')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .trim();

const normalizedSql = (field: SQLWrapper) =>
  sql`lower(regexp_replace(translate(${field}, 'أإآٱىةک', 'اااايهك'), '[ًٌٍَُِّْـ]', '', 'g'))`;

@Injectable()
export class PlatformReadService {
  constructor(@Inject(DATABASE) private readonly db: AtharDatabase) {}

  async facets() {
    const rows = await this.db
      .select({
        id: vocabularyValues.id,
        slug: vocabularyValues.slug,
        labelAr: vocabularyValues.labelAr,
        labelLatin: vocabularyValues.labelLatin,
        type: vocabularyValues.type,
        displayOrder: vocabularyValues.displayOrder,
      })
      .from(vocabularyValues)
      .where(eq(vocabularyValues.isActive, true))
      .orderBy(
        asc(vocabularyValues.type),
        asc(vocabularyValues.displayOrder),
        asc(vocabularyValues.labelAr),
      );
    const facets = Object.fromEntries(
      vocabularyTypes.map((type) => [type, [] as typeof rows]),
    ) as Record<VocabularyType, typeof rows>;
    for (const row of rows) facets[row.type].push(row);
    return facets;
  }

  async list(query: PlatformDirectoryQuery) {
    const normalizedQuery = query.q ? normalizeSearch(query.q) : '';
    const conditions = [eq(platforms.lifecycle, 'published')];
    if (query.availability?.length) {
      conditions.push(inArray(platforms.availabilityState, query.availability));
    } else if (!normalizedQuery) {
      conditions.push(ne(platforms.availabilityState, 'suspended_or_closed'));
    }

    const requestedFilters: Array<[VocabularyType, string[] | undefined]> = [
      ['category', query.category],
      ['opportunity_type', query.opportunityType],
      ['payment_method', query.paymentMethod],
      ['experience_level', query.experienceLevel],
    ];
    for (const [type, slugs] of requestedFilters) {
      if (!slugs?.length) continue;
      conditions.push(
        exists(
          this.db
            .select({ one: sql`1` })
            .from(platformVocabularyLinks)
            .innerJoin(
              vocabularyValues,
              eq(
                platformVocabularyLinks.vocabularyValueId,
                vocabularyValues.id,
              ),
            )
            .where(
              and(
                eq(platformVocabularyLinks.platformId, platforms.id),
                eq(vocabularyValues.type, type),
                inArray(vocabularyValues.slug, slugs),
                eq(vocabularyValues.isActive, true),
              ),
            ),
        ),
      );
    }

    if (normalizedQuery) {
      const term = `%${normalizedQuery.replace(/[\\%_]/g, '\\$&')}%`;
      const vocabSearch = exists(
        this.db
          .select({ one: sql`1` })
          .from(platformVocabularyLinks)
          .innerJoin(
            vocabularyValues,
            eq(platformVocabularyLinks.vocabularyValueId, vocabularyValues.id),
          )
          .where(
            and(
              eq(platformVocabularyLinks.platformId, platforms.id),
              inArray(vocabularyValues.type, [
                'category',
                'work_type',
                'payment_method',
              ]),
              eq(vocabularyValues.isActive, true),
              or(
                sql`${normalizedSql(vocabularyValues.labelAr)} LIKE ${term}`,
                sql`${normalizedSql(vocabularyValues.labelLatin)} LIKE ${term}`,
                sql`${normalizedSql(vocabularyValues.slug)} LIKE ${term}`,
              ),
            ),
          ),
      );
      const nameOrSlugMatch = or(
        sql`${normalizedSql(platforms.name)} LIKE ${term}`,
        sql`${normalizedSql(platforms.slug)} LIKE ${term}`,
      )!;
      conditions.push(
        query.availability?.length
          ? or(nameOrSlugMatch, vocabSearch)!
          : or(
              nameOrSlugMatch,
              and(
                ne(platforms.availabilityState, 'suspended_or_closed'),
                vocabSearch,
              ),
            )!,
      );
    }

    const where = and(...conditions);
    const lastVerified = sql<string | null>`(
      select min(${verificationRecords.lastVerifiedOn})
      from ${factItems}
      inner join ${verificationRecords} on ${verificationRecords.factItemId} = ${factItems.id}
      where ${factItems.platformId} = ${platforms.id}
        and ${factItems.key} in ('egypt_availability', 'registration_requirements', 'tests_acceptance', 'payment_methods', 'withdrawal_conditions')
    )`;
    const popularity = sql<number>`coalesce((
      select ${popularitySnapshots.distinctUsers} from ${popularitySnapshots}
      where ${popularitySnapshots.platformId} = ${platforms.id}
      order by ${popularitySnapshots.computedAt} desc limit 1
    ), 0)`;
    const relevance = normalizedQuery
      ? sql<number>`case
          when ${normalizedSql(platforms.name)} = ${normalizedQuery} then 0
          when ${normalizedSql(platforms.name)} like ${`${normalizedQuery}%`} then 1
          when ${normalizedSql(platforms.slug)} like ${`${normalizedQuery}%`} then 2
          else 3
        end`
      : sql<number>`0`;
    const sort = query.sort ?? (normalizedQuery ? 'relevance' : 'popularity');
    const ordering =
      sort === 'newest'
        ? [desc(platforms.publishedAt), asc(platforms.name)]
        : sort === 'last_verification'
          ? [desc(lastVerified), asc(platforms.name)]
          : sort === 'relevance' && normalizedQuery
            ? [
                asc(relevance),
                desc(popularity),
                desc(lastVerified),
                asc(platforms.name),
              ]
            : sort === 'popularity' || sort === 'relevance'
              ? [desc(popularity), desc(lastVerified), asc(platforms.name)]
              : [desc(lastVerified), asc(platforms.name)];

    const [{ total = 0 } = {}] = await this.db
      .select({ total: sql<number>`count(*)::int` })
      .from(platforms)
      .where(where);
    const offset = (query.page - 1) * query.pageSize;
    const platformRows = await this.db
      .select({
        id: platforms.id,
        slug: platforms.slug,
        name: platforms.name,
        availabilityState: platforms.availabilityState,
        restrictionNote: platforms.restrictionNote,
        publishedAt: platforms.publishedAt,
        lastVerifiedOn: lastVerified,
      })
      .from(platforms)
      .where(where)
      .orderBy(...ordering)
      .limit(query.pageSize)
      .offset(offset);

    const ids = platformRows.map((row) => row.id);
    const categoryRows = ids.length
      ? await this.db
          .select({
            platformId: platformVocabularyLinks.platformId,
            id: vocabularyValues.id,
            slug: vocabularyValues.slug,
            labelAr: vocabularyValues.labelAr,
            labelLatin: vocabularyValues.labelLatin,
            type: vocabularyValues.type,
            displayOrder: vocabularyValues.displayOrder,
          })
          .from(platformVocabularyLinks)
          .innerJoin(
            vocabularyValues,
            eq(platformVocabularyLinks.vocabularyValueId, vocabularyValues.id),
          )
          .where(
            and(
              inArray(platformVocabularyLinks.platformId, ids),
              eq(vocabularyValues.type, 'category'),
              eq(vocabularyValues.isActive, true),
            ),
          )
          .orderBy(
            asc(vocabularyValues.displayOrder),
            asc(vocabularyValues.labelAr),
          )
      : [];
    const categoriesByPlatform = new Map<string, typeof categoryRows>();
    for (const category of categoryRows)
      categoriesByPlatform.set(category.platformId, [
        ...(categoriesByPlatform.get(category.platformId) ?? []),
        category,
      ]);

    const warningIds = ids.length
      ? await this.db
          .select({ platformId: warningCases.platformId })
          .from(warningCases)
          .where(
            and(
              inArray(warningCases.platformId, ids),
              eq(warningCases.status, 'open'),
            ),
          )
      : [];
    const warningSet = new Set(warningIds.map((row) => row.platformId));
    const facets = await this.facets();
    return {
      items: platformRows.map((row) => ({
        id: row.id,
        slug: row.slug,
        name: row.name,
        categories: (categoriesByPlatform.get(row.id) ?? []).map(
          (category) => ({
            id: category.id,
            slug: category.slug,
            labelAr: category.labelAr,
            labelLatin: category.labelLatin,
            type: category.type,
            displayOrder: category.displayOrder,
          }),
        ),
        availabilityState: row.availabilityState,
        restrictionNote: row.restrictionNote,
        warningActive: warningSet.has(row.id),
        rating: null,
        lastVerifiedOn: row.lastVerifiedOn,
        publishedAt: row.publishedAt?.toISOString() ?? null,
      })),
      total,
      page: query.page,
      pageSize: query.pageSize,
      pageCount: Math.ceil(total / query.pageSize),
      facets,
    };
  }

  async getBySlug(slug: string) {
    const [platform] = await this.db
      .select({
        id: platforms.id,
        slug: platforms.slug,
        name: platforms.name,
        availabilityState: platforms.availabilityState,
        restrictionNote: platforms.restrictionNote,
        publishedAt: platforms.publishedAt,
      })
      .from(platforms)
      .where(
        and(eq(platforms.slug, slug), eq(platforms.lifecycle, 'published')),
      )
      .limit(1);
    if (!platform) return null;
    const categoryRows = await this.db
      .select({
        id: vocabularyValues.id,
        slug: vocabularyValues.slug,
        labelAr: vocabularyValues.labelAr,
        labelLatin: vocabularyValues.labelLatin,
        type: vocabularyValues.type,
        displayOrder: vocabularyValues.displayOrder,
      })
      .from(platformVocabularyLinks)
      .innerJoin(
        vocabularyValues,
        eq(platformVocabularyLinks.vocabularyValueId, vocabularyValues.id),
      )
      .where(
        and(
          eq(platformVocabularyLinks.platformId, platform.id),
          eq(vocabularyValues.type, 'category'),
          eq(vocabularyValues.isActive, true),
        ),
      )
      .orderBy(
        asc(vocabularyValues.displayOrder),
        asc(vocabularyValues.labelAr),
      );
    const [lastVerifiedRow] = await this.db
      .select({
        lastVerifiedOn: sql<string | null>`(
      select min(${verificationRecords.lastVerifiedOn})
      from ${factItems} inner join ${verificationRecords} on ${verificationRecords.factItemId} = ${factItems.id}
      where ${factItems.platformId} = ${platform.id}
        and ${factItems.key} in ('egypt_availability', 'registration_requirements', 'tests_acceptance', 'payment_methods', 'withdrawal_conditions')
    )`,
      })
      .from(platforms)
      .where(eq(platforms.id, platform.id));
    const card = {
      ...platform,
      categories: categoryRows,
      warningActive: false,
      rating: null,
      lastVerifiedOn: lastVerifiedRow?.lastVerifiedOn ?? null,
      publishedAt: platform.publishedAt?.toISOString() ?? null,
    };
    const facts = await this.db
      .select({
        id: factItems.id,
        key: factItems.key,
        valueText: factItems.valueText,
        status: verificationRecords.status,
        lastVerifiedOn: verificationRecords.lastVerifiedOn,
      })
      .from(factItems)
      .innerJoin(
        verificationRecords,
        eq(verificationRecords.factItemId, factItems.id),
      )
      .where(
        and(
          eq(factItems.platformId, platform.id),
          eq(factItems.isVisible, true),
          eq(verificationRecords.status, 'verified'),
          isNotNull(verificationRecords.reviewerAccountId),
          ne(verificationRecords.reviewerAccountId, factItems.lastEditedBy),
          exists(
            this.db
              .select({ one: sql`1` })
              .from(sources)
              .where(
                and(
                  eq(sources.factItemId, factItems.id),
                  ne(sources.type, 'user_reports_support'),
                ),
              ),
          ),
        ),
      )
      .orderBy(asc(factItems.key));
    const factIds = facts.map(({ id }) => id);
    const sourceRows = factIds.length
      ? await this.db
          .select({
            factItemId: sources.factItemId,
            type: sources.type,
            title: sources.title,
            url: sources.url,
            accessedOn: sources.accessedOn,
            testScope: sources.testScope,
          })
          .from(sources)
          .where(
            and(
              inArray(sources.factItemId, factIds),
              ne(sources.type, 'user_reports_support'),
            ),
          )
      : [];
    const publicLinkFactIds = facts
      .filter((fact) => fact.key === 'official_links')
      .map((fact) => fact.id);
    const links = publicLinkFactIds.length
      ? await this.db
          .select({
            factItemId: factLinks.factItemId,
            title: factLinks.title,
            url: factLinks.url,
            position: factLinks.position,
          })
          .from(factLinks)
          .where(inArray(factLinks.factItemId, publicLinkFactIds))
          .orderBy(asc(factLinks.position))
      : [];
    const linksByFact = new Map<string, typeof links>();
    for (const link of links)
      linksByFact.set(link.factItemId, [
        ...(linksByFact.get(link.factItemId) ?? []),
        link,
      ]);
    const historyRows = await this.db
      .select({
        kind: platformStatusHistory.kind,
        fromValue: platformStatusHistory.fromValue,
        toValue: platformStatusHistory.toValue,
        note: platformStatusHistory.note,
        sourceSummary: platformStatusHistory.sourceSummary,
        occurredAt: platformStatusHistory.occurredAt,
      })
      .from(platformStatusHistory)
      .where(eq(platformStatusHistory.platformId, platform.id))
      .orderBy(asc(platformStatusHistory.occurredAt));
    const warning = await this.db
      .select({ platformId: warningCases.platformId })
      .from(warningCases)
      .where(
        and(
          eq(warningCases.platformId, platform.id),
          eq(warningCases.status, 'open'),
        ),
      )
      .limit(1);
    return {
      ...card,
      warningActive: warning.length > 0,
      facts: facts
        .filter((fact) => fact.status !== null)
        .map((fact) => ({
          key: fact.key,
          valueText: fact.valueText,
          verification: {
            status: fact.status!,
            lastVerifiedOn: fact.lastVerifiedOn,
            sources: sourceRows
              .filter((source) => source.factItemId === fact.id)
              .map((source) => ({
                type: source.type,
                title: source.title,
                url: source.url,
                accessedOn: source.accessedOn,
                testScope: source.testScope,
              })),
          },
          links: (linksByFact.get(fact.id) ?? []).map((link) => ({
            title: link.title,
            url: link.url,
            position: link.position,
          })),
        })),
      statusHistory: historyRows.map((row) => ({
        ...row,
        occurredAt: row.occurredAt.toISOString(),
      })),
    };
  }
}
