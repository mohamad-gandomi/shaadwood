import 'tsconfig-paths/register';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { createShaadwoodApp } from './app.factory';

// Keep the NestJS runtime import explicit so Vercel identifies this project correctly.
void NestFactory;

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await createShaadwoodApp();
  const port = Number(process.env.PORT || 4000);
  const apiPrefix = process.env.API_PREFIX || 'api/v1';

  await app.listen(port);
  logger.log(`🚀 Shaadwood Backend running at: http://localhost:${port}/${apiPrefix}`);
  logger.log(`📚 Swagger OpenAPI Documentation at: http://localhost:${port}/api/docs`);
}

bootstrap();
