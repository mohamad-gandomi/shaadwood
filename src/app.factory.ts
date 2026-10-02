import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as path from 'path';
import { AppModule } from '@/app.module';
import { AllExceptionsFilter } from '@/common/filters/http-exception.filter';
import { TransformInterceptor } from '@/common/interceptors/transform.interceptor';

export async function createShaadwoodApp(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const apiPrefix = configService.get<string>('apiPrefix', 'api/v1');
  const corsOrigin = configService.get<string | string[]>('corsOrigin', '*');

  app.enableCors({
    origin: corsOrigin === '*' ? true : corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  app.setGlobalPrefix(apiPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Vercel's filesystem is read-only and ephemeral. Uploads are intentionally
  // disabled for the demo deployment; local/Plesk deployments retain them.
  if (!process.env.VERCEL) {
    const uploadDir = path.resolve(
      process.cwd(),
      configService.get<string>('upload.dir', './uploads'),
    );
    app.useStaticAssets(uploadDir, { prefix: '/uploads/' });
  }

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Shaadwood Furniture Shop API')
    .setDescription('REST API for the Shaadwood furniture store.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        in: 'header',
      },
      'bearer',
    )
    .build();

  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
    { customSiteTitle: 'Shaadwood API Docs' },
  );

  await app.init();
  return app;
}
