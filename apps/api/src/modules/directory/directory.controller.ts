import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseFilters,
} from '@nestjs/common';
import {
  PlatformDirectoryQuerySchema,
  createOpenApiDocument,
} from '@athar/contracts';
import { PlatformReadService } from '../platforms';
import { DirectoryExceptionFilter } from './directory-exception.filter';

@Controller('platforms')
@UseFilters(DirectoryExceptionFilter)
export class DirectoryController {
  constructor(private readonly platforms: PlatformReadService) {}

  @Get()
  async list(@Query() rawQuery: Record<string, unknown>) {
    const parsed = PlatformDirectoryQuerySchema.safeParse(rawQuery);
    if (!parsed.success) throw new BadRequestException();
    return this.platforms.list(parsed.data);
  }

  @Get('facets')
  async facets() {
    return this.platforms.facets();
  }

  @Get(':slug')
  async details(@Param('slug') slug: string) {
    const details = await this.platforms.getBySlug(slug);
    if (!details) throw new NotFoundException();
    return details;
  }
}

@Controller()
@UseFilters(DirectoryExceptionFilter)
export class OpenApiController {
  @Get('openapi.json')
  document() {
    return createOpenApiDocument();
  }
}
