import {
  extendZodWithOpenApi,
  OpenAPIRegistry,
  OpenApiGeneratorV31,
} from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const AvailabilityStateSchema = z.enum([
  'available',
  'available_with_restrictions',
  'unavailable',
  'suspended_or_closed',
  'not_yet_confirmed',
]);

export const VocabularyTypeSchema = z.enum([
  'category',
  'work_type',
  'opportunity_type',
  'experience_level',
  'payment_method',
]);

export const DirectorySortSchema = z.enum([
  'relevance',
  'popularity',
  'rating',
  'newest',
  'last_verification',
]);

const optionalListInput = (value: unknown): unknown => {
  if (value === undefined) return undefined;
  const values = Array.isArray(value) ? value : [value];
  const nonEmpty = values.filter(
    (item) => !(typeof item === 'string' && item.trim() === ''),
  );
  return nonEmpty.length === 0 ? undefined : nonEmpty;
};

const availabilityList = z.preprocess(
  optionalListInput,
  z.array(AvailabilityStateSchema).optional(),
);

const slugList = z.preprocess(
  optionalListInput,
  z.array(z.string().trim().min(1).max(80)).optional(),
);

export const PlatformDirectoryQuerySchema = z
  .object({
    q: z.string().trim().max(120).optional(),
    category: slugList,
    availability: availabilityList,
    opportunityType: slugList,
    paymentMethod: slugList,
    experienceLevel: slugList,
    sort: DirectorySortSchema.optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
  })
  .strict();

export type PlatformDirectoryQuery = z.infer<
  typeof PlatformDirectoryQuerySchema
>;

export const VocabularyOptionSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  labelAr: z.string(),
  labelLatin: z.string().nullable(),
  type: VocabularyTypeSchema,
  displayOrder: z.number().int(),
});

export const VerificationStatusSchema = z.enum([
  'verified',
  'needs_review',
  'unconfirmed',
]);

export const PlatformFactSchema = z.object({
  key: z.enum([
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
  ]),
  valueText: z.string().nullable(),
  verification: z.object({
    status: VerificationStatusSchema,
    lastVerifiedOn: z.iso.date().nullable(),
    sources: z.array(
      z.object({
        type: z.enum(['platform_document', 'athar_test', 'third_party_report']),
        title: z.string(),
        url: z.url().nullable(),
        accessedOn: z.iso.date(),
        testScope: z.string().nullable(),
      }),
    ),
  }),
  links: z.array(
    z.object({ title: z.string(), url: z.url(), position: z.number().int() }),
  ),
});

export const PlatformCardSchema = z.object({
  id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  categories: z.array(VocabularyOptionSchema),
  availabilityState: AvailabilityStateSchema,
  restrictionNote: z.string().nullable(),
  warningActive: z.boolean(),
  rating: z
    .object({
      average: z.number().nullable(),
      totalReviews: z.number().int(),
      qualifyingCount: z.number().int(),
    })
    .nullable(),
  lastVerifiedOn: z.iso.date().nullable(),
  publishedAt: z.iso.datetime().nullable(),
});

export const PlatformDirectoryResponseSchema = z.object({
  items: z.array(PlatformCardSchema),
  total: z.number().int(),
  page: z.number().int(),
  pageSize: z.number().int(),
  pageCount: z.number().int(),
  facets: z.record(VocabularyTypeSchema, z.array(VocabularyOptionSchema)),
});

export const PlatformFacetsResponseSchema = z.record(
  VocabularyTypeSchema,
  z.array(VocabularyOptionSchema),
);

export const PlatformDetailsResponseSchema = PlatformCardSchema.extend({
  facts: z.array(PlatformFactSchema),
  statusHistory: z.array(
    z.object({
      kind: z.enum(['availability', 'warning', 'lifecycle']),
      fromValue: z.string(),
      toValue: z.string(),
      note: z.string().nullable(),
      sourceSummary: z.string().nullable(),
      occurredAt: z.iso.datetime(),
    }),
  ),
});

export const DirectoryErrorSchema = z.object({
  error: z.object({
    code: z.enum(['VALIDATION_ERROR', 'NOT_FOUND', 'INTERNAL_ERROR']),
    message: z.string(),
  }),
  path: z.string(),
});

const registry = new OpenAPIRegistry();
const QuerySchema = registry.register(
  'PlatformDirectoryQuery',
  PlatformDirectoryQuerySchema,
);
const DirectoryResponse = registry.register(
  'PlatformDirectoryResponse',
  PlatformDirectoryResponseSchema,
);
const PlatformDetails = registry.register(
  'PlatformDetailsResponse',
  PlatformDetailsResponseSchema,
);
registry.register('VocabularyOption', VocabularyOptionSchema);
const DirectoryError = registry.register(
  'DirectoryError',
  DirectoryErrorSchema,
);

registry.registerPath({
  method: 'get',
  path: '/api/v1/platforms',
  summary: 'Search and list published platforms',
  request: { query: QuerySchema },
  responses: {
    200: {
      description: 'Filtered platform directory',
      content: { 'application/json': { schema: DirectoryResponse } },
    },
    400: {
      description: 'Query validation error',
      content: { 'application/json': { schema: DirectoryError } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/platforms/facets',
  summary: 'List active directory filter options',
  responses: {
    200: {
      description: 'Active vocabulary options grouped by type',
      content: { 'application/json': { schema: PlatformFacetsResponseSchema } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/v1/platforms/{slug}',
  summary: 'Get published platform details',
  request: { params: z.object({ slug: z.string().min(1).max(80) }) },
  responses: {
    200: {
      description: 'Public platform facts and verification details',
      content: { 'application/json': { schema: PlatformDetails } },
    },
    404: {
      description: 'Platform not found',
      content: { 'application/json': { schema: DirectoryError } },
    },
  },
});

export function createOpenApiDocument(): object {
  return new OpenApiGeneratorV31(registry.definitions).generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'ATHAR Platform Directory API',
      version: '1.0.0',
      description:
        'Public endpoints for browsing, searching, filtering and viewing published platforms.',
    },
    servers: [{ url: '/' }],
  });
}
