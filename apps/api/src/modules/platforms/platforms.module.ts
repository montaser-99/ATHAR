import { Module } from '@nestjs/common';
import { PlatformReadService } from './platform-read.service';

@Module({ providers: [PlatformReadService], exports: [PlatformReadService] })
export class PlatformsModule {}
