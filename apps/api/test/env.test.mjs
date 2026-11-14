import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';
import { test } from 'node:test';

const apiDirectory = join(import.meta.dirname, '..');

function runEnvironmentConfig(overrides) {
  return spawnSync(
    process.execPath,
    ['-e', "require('./dist/platform/config/env.js')"],
    {
      cwd: apiDirectory,
      encoding: 'utf8',
      env: {
        ...process.env,
        NODE_ENV: 'test',
        DATABASE_URL:
          'postgresql://athar:athar_local_only@127.0.0.1:5432/athar_dev',
        MAIL_HOST: '127.0.0.1',
        MAIL_PORT: '1025',
        ...overrides,
      },
    },
  );
}

test('accepts a valid local API environment', () => {
  const result = runEnvironmentConfig({});

  assert.equal(result.status, 0, result.stderr);
});

test('fails fast when required database or mail settings are empty', () => {
  const result = runEnvironmentConfig({
    DATABASE_URL: '',
    MAIL_HOST: '',
    MAIL_PORT: '',
  });
  const output = `${result.stdout}${result.stderr}`;

  assert.notEqual(result.status, 0);
  assert.match(
    output,
    /Invalid API environment configuration: DATABASE_URL, MAIL_HOST, MAIL_PORT/,
  );
  assert.doesNotMatch(output, /athar_local_only/);
});
