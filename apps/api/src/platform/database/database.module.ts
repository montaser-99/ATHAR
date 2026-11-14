import { Global, Injectable, Module, OnModuleDestroy } from '@nestjs/common';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { env } from '../config/env';
import { schema } from './schema';

export const DATABASE = Symbol('ATHAR_DATABASE');
export type AtharDatabase = NodePgDatabase<typeof schema>;

@Injectable()
class PostgresPool extends Pool implements OnModuleDestroy {
  onModuleDestroy(): Promise<void> {
    return this.end();
  }
}

@Global()
@Module({
  providers: [
    {
      provide: PostgresPool,
      useFactory: () =>
        new PostgresPool({ connectionString: env.DATABASE_URL }),
    },
    {
      provide: DATABASE,
      inject: [PostgresPool],
      useFactory: (pool: PostgresPool): AtharDatabase =>
        drizzle({ client: pool, schema }),
    },
  ],
  exports: [DATABASE],
})
export class DatabaseModule {}
