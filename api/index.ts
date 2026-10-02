import 'tsconfig-paths/register';
import type { Request, Response } from 'express';
import { NestFactory } from '@nestjs/core';
import { createShaadwoodApp } from '../src/app.factory';

// Keep the NestJS runtime import explicit so Vercel selects the NestJS builder.
void NestFactory;

let appPromise: ReturnType<typeof createShaadwoodApp> | undefined;

export default async function handler(req: Request, res: Response) {
  appPromise ??= createShaadwoodApp();
  const app = await appPromise;
  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
}
