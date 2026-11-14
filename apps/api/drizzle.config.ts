import { resolve } from 'node:path';
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: resolve(process.cwd(), '../../.env') });

// Drizzle's schema diff command does not connect to PostgreSQL. This local-only
// fallback keeps migration generation available before a developer has .env.
// migrate/seed still need a reachable database configured through DATABASE_URL.
const databaseUrl =
  process.env.DATABASE_URL ??
  'postgresql://athar:athar_local_only@127.0.0.1:5432/athar_dev';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/platform/database/schema.ts',
  out: '../../db/migrations',
  dbCredentials: { url: databaseUrl },
  strict: true,
  verbose: true,
});
