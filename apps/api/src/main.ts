import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './platform/config/env';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  app.setGlobalPrefix('api/v1', { exclude: ['healthz', 'openapi.json'] });
  await app.listen(env.PORT, env.HOST);
}

void bootstrap();
