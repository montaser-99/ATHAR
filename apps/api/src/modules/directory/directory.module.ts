import { Module } from '@nestjs/common';
import { PlatformsModule } from '../platforms';
import { DirectoryController, OpenApiController } from './directory.controller';

@Module({
  imports: [PlatformsModule],
  controllers: [DirectoryController, OpenApiController],
})
export class DirectoryModule {}
