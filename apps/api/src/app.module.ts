import { Module } from '@nestjs/common';
import { HealthModule } from './platform/health/health.module';
import { DatabaseModule } from './platform/database/database.module';
import { DirectoryModule } from './modules/directory/directory.module';

@Module({
  imports: [DatabaseModule, HealthModule, DirectoryModule],
})
export class AppModule {}
