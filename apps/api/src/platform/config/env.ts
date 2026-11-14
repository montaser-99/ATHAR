import dotenv from 'dotenv';
import { resolve } from 'node:path';
import { z } from 'zod';

dotenv.config({ path: resolve(process.cwd(), '../../.env') });

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().min(1).max(65_535).default(4000),
  HOST: z.string().min(1).default('127.0.0.1'),
  DATABASE_URL: z
    .url()
    .refine(
      (value) =>
        value.startsWith('postgres://') || value.startsWith('postgresql://'),
    ),
  MAIL_HOST: z.string().min(1),
  MAIL_PORT: z.coerce.number().int().min(1).max(65_535),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const invalidKeys = [
    ...new Set(parsedEnv.error.issues.map((issue) => issue.path.join('.'))),
  ].join(', ');
  throw new Error(`Invalid API environment configuration: ${invalidKeys}`);
}

export const env = parsedEnv.data;
