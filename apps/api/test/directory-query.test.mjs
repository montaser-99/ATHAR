import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createOpenApiDocument,
  PlatformDirectoryQuerySchema,
} from '@athar/contracts';

test('directory query supplies documented pagination defaults', () => {
  assert.deepEqual(PlatformDirectoryQuerySchema.parse({}), {
    page: 1,
    pageSize: 20,
  });
});

test('directory query accepts repeated filters for multi-select OR filters', () => {
  const query = PlatformDirectoryQuerySchema.parse({
    category: ['design', 'writing'],
    availability: ['available', 'available_with_restrictions'],
  });
  assert.deepEqual(query.category, ['design', 'writing']);
  assert.deepEqual(query.availability, [
    'available',
    'available_with_restrictions',
  ]);
});

test('directory query ignores blank native select values', () => {
  const query = PlatformDirectoryQuerySchema.parse({
    category: '',
    availability: '',
  });
  assert.equal(query.category, undefined);
  assert.equal(query.availability, undefined);
});

test('directory query rejects unknown and invalid properties', () => {
  assert.equal(
    PlatformDirectoryQuerySchema.safeParse({ accountId: 'private' }).success,
    false,
  );
  assert.equal(
    PlatformDirectoryQuerySchema.safeParse({ page: '0' }).success,
    false,
  );
  assert.equal(
    PlatformDirectoryQuerySchema.safeParse({ q: 'x'.repeat(121) }).success,
    false,
  );
});

test('OpenAPI document describes the public directory endpoints', () => {
  const document = createOpenApiDocument();
  assert.ok(document.paths['/api/v1/platforms']);
  assert.ok(document.paths['/api/v1/platforms/facets']);
  assert.ok(document.paths['/api/v1/platforms/{slug}']);
});
