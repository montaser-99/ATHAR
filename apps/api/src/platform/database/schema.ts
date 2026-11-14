import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  date,
  foreignKey,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const platformLifecycle = pgEnum('platform_lifecycle', [
  'draft',
  'published',
  'unpublished',
  'merged',
]);

export const platformAvailability = pgEnum('platform_availability', [
  'available',
  'available_with_restrictions',
  'unavailable',
  'suspended_or_closed',
  'not_yet_confirmed',
]);

export const vocabularyType = pgEnum('vocabulary_type', [
  'category',
  'work_type',
  'opportunity_type',
  'experience_level',
  'payment_method',
]);

export const factKey = pgEnum('fact_key', [
  'identity_overview',
  'egypt_availability',
  'registration_requirements',
  'registration_steps',
  'tests_acceptance',
  'payment_methods',
  'withdrawal_conditions',
  'work_types',
  'experience_level',
  'eligibility',
  'official_links',
]);

export const verificationStatus = pgEnum('verification_status', [
  'verified',
  'needs_review',
  'unconfirmed',
]);

export const needsReviewReason = pgEnum('needs_review_reason', [
  'overdue',
  'disputed',
  'contradicted',
]);

export const sourceType = pgEnum('source_type', [
  'platform_document',
  'athar_test',
  'third_party_report',
  'user_reports_support',
]);

export const statusHistoryKind = pgEnum('platform_status_history_kind', [
  'availability',
  'warning',
  'lifecycle',
]);

export const warningIntakeBasis = pgEnum('warning_intake_basis', [
  'multiple_independent_reports',
  'documented_report',
  'official_notice',
]);

export const warningCaseStatus = pgEnum('warning_case_status', [
  'triage',
  'open',
  'lifted',
  'replaced_by_note',
  'closed_as_suspended',
]);

// Permanent platform retention is additionally protected by a database trigger
// in the migration because Drizzle's table schema DSL does not model triggers.
export const platforms = pgTable(
  'platforms',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: varchar('slug', { length: 80 }).notNull(),
    name: varchar('name', { length: 150 }).notNull(),
    lifecycle: platformLifecycle('lifecycle').notNull().default('draft'),
    publishedAt: timestamp('published_at', {
      withTimezone: true,
      mode: 'date',
    }),
    availabilityState: platformAvailability('availability_state')
      .notNull()
      .default('not_yet_confirmed'),
    restrictionNote: varchar('restriction_note', { length: 500 }),
    warningActive: boolean('warning_active').notNull().default(false),
    mergedIntoPlatformId: uuid('merged_into_platform_id'),
    // Cross-module Account reference; identity owns account existence and deletion.
    createdBy: uuid('created_by').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique('platforms_slug_unique').on(table.slug),
    index('platforms_lifecycle_published_idx').on(
      table.lifecycle,
      table.publishedAt,
    ),
    index('platforms_availability_idx').on(
      table.availabilityState,
      table.lifecycle,
    ),
    check(
      'platforms_restriction_note_required',
      sql`${table.availabilityState} <> 'available_with_restrictions' OR (length(trim(${table.restrictionNote})) > 0)`,
    ),
    check(
      'platforms_no_self_merge',
      sql`${table.mergedIntoPlatformId} IS NULL OR ${table.mergedIntoPlatformId} <> ${table.id}`,
    ),
    foreignKey({
      name: 'platforms_merged_into_fk',
      columns: [table.mergedIntoPlatformId],
      foreignColumns: [table.id],
    }).onDelete('restrict'),
    check(
      'platforms_merged_reference_matches_lifecycle',
      sql`(${table.lifecycle} = 'merged') = (${table.mergedIntoPlatformId} IS NOT NULL)`,
    ),
  ],
);

export const vocabularyValues = pgTable(
  'vocabulary_values',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    type: vocabularyType('type').notNull(),
    slug: varchar('slug', { length: 80 }).notNull(),
    labelAr: varchar('label_ar', { length: 100 }).notNull(),
    labelLatin: varchar('label_latin', { length: 100 }),
    displayOrder: integer('display_order').notNull().default(0),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique('vocabulary_values_type_slug_unique').on(table.type, table.slug),
    index('vocabulary_values_active_type_order_idx').on(
      table.type,
      table.isActive,
      table.displayOrder,
    ),
  ],
);

export const platformVocabularyLinks = pgTable(
  'platform_vocabulary_links',
  {
    platformId: uuid('platform_id')
      .notNull()
      .references(() => platforms.id, { onDelete: 'restrict' }),
    vocabularyValueId: uuid('vocabulary_value_id')
      .notNull()
      .references(() => vocabularyValues.id, { onDelete: 'restrict' }),
  },
  (table) => [
    primaryKey({ columns: [table.platformId, table.vocabularyValueId] }),
    index('platform_vocabulary_links_value_platform_idx').on(
      table.vocabularyValueId,
      table.platformId,
    ),
  ],
);

export const factItems = pgTable(
  'fact_items',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    platformId: uuid('platform_id')
      .notNull()
      .references(() => platforms.id, { onDelete: 'restrict' }),
    key: factKey('fact_key').notNull(),
    valueText: varchar('value_text', { length: 4000 }),
    isVisible: boolean('is_visible').notNull().default(false),
    lastEditedBy: uuid('last_edited_by').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    unique('fact_items_platform_key_unique').on(table.platformId, table.key),
    index('fact_items_platform_idx').on(table.platformId, table.key),
    check(
      'fact_items_egypt_availability_has_no_value',
      sql`${table.key} <> 'egypt_availability' OR ${table.valueText} IS NULL`,
    ),
  ],
);

export const verificationRecords = pgTable('verification_records', {
  factItemId: uuid('fact_item_id')
    .primaryKey()
    .references(() => factItems.id, { onDelete: 'cascade' }),
  status: verificationStatus('status').notNull().default('unconfirmed'),
  needsReviewReason: needsReviewReason('needs_review_reason'),
  lastVerifiedOn: date('last_verified_on', { mode: 'string' }),
  nextDueAt: timestamp('next_due_at', { withTimezone: true, mode: 'date' }),
  reviewerAccountId: uuid('reviewer_account_id'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' })
    .notNull()
    .defaultNow(),
});

export const sources = pgTable(
  'sources',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    factItemId: uuid('fact_item_id')
      .notNull()
      .references(() => verificationRecords.factItemId, {
        onDelete: 'cascade',
      }),
    type: sourceType('type').notNull(),
    title: varchar('title', { length: 200 }).notNull(),
    url: text('url'),
    accessedOn: date('accessed_on', { mode: 'string' }).notNull(),
    testScope: varchar('test_scope', { length: 300 }),
    addedBy: uuid('added_by').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('sources_fact_item_idx').on(table.factItemId),
    check(
      'sources_athar_test_requires_scope',
      sql`${table.type} <> 'athar_test' OR ${table.testScope} IS NOT NULL`,
    ),
  ],
);

export const factLinks = pgTable(
  'fact_links',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    factItemId: uuid('fact_item_id')
      .notNull()
      .references(() => factItems.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 150 }).notNull(),
    url: text('url').notNull(),
    position: integer('position').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('fact_links_item_position_idx').on(table.factItemId, table.position),
  ],
);

export const platformStatusHistory = pgTable(
  'platform_status_history',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    platformId: uuid('platform_id')
      .notNull()
      .references(() => platforms.id, { onDelete: 'restrict' }),
    kind: statusHistoryKind('kind').notNull(),
    fromValue: varchar('from_value', { length: 50 }).notNull(),
    toValue: varchar('to_value', { length: 50 }).notNull(),
    note: varchar('note', { length: 500 }),
    sourceSummary: varchar('source_summary', { length: 300 }),
    occurredAt: timestamp('occurred_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
    approvalRequestId: uuid('approval_request_id'),
  },
  (table) => [
    index('platform_status_history_platform_date_idx').on(
      table.platformId,
      table.occurredAt,
    ),
  ],
);

export const warningCases = pgTable(
  'warning_cases',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    platformId: uuid('platform_id')
      .notNull()
      .references(() => platforms.id, { onDelete: 'restrict' }),
    intakeBasis: warningIntakeBasis('intake_basis').notNull(),
    status: warningCaseStatus('status').notNull(),
    openedAt: timestamp('opened_at', {
      withTimezone: true,
      mode: 'date',
    }).notNull(),
    triageDueAt: timestamp('triage_due_at', {
      withTimezone: true,
      mode: 'date',
    }),
    nextReviewDueAt: timestamp('next_review_due_at', {
      withTimezone: true,
      mode: 'date',
    }),
    resolveBy: timestamp('resolve_by', { withTimezone: true, mode: 'date' }),
    publicNote: varchar('public_note', { length: 500 }),
    approvalRequestId: uuid('approval_request_id'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('warning_cases_platform_status_idx').on(
      table.platformId,
      table.status,
    ),
    uniqueIndex('warning_cases_one_open_per_platform_idx')
      .on(table.platformId)
      .where(sql`${table.status} IN ('triage', 'open')`),
  ],
);

export const popularitySnapshots = pgTable(
  'popularity_snapshots',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    platformId: uuid('platform_id').notNull(),
    distinctUsers: integer('distinct_users').notNull(),
    windowDays: integer('window_days').notNull(),
    computedAt: timestamp('computed_at', { withTimezone: true, mode: 'date' })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('popularity_snapshots_platform_computed_idx').on(
      table.platformId,
      table.computedAt,
    ),
    check(
      'popularity_snapshots_non_negative',
      sql`${table.distinctUsers} >= 0 AND ${table.windowDays} > 0`,
    ),
  ],
);

export const schema = {
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
};
