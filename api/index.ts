import type { Request, Response } from 'express';
import { NestFactory } from '@nestjs/core';
import { register } from 'tsconfig-paths';

void NestFactory;

// The Vercel function bundle retains the compiled src/ files, but not the
// TypeScript compiler's alias resolver. Register the alias before loading Nest.
register({
  baseUrl: process.cwd(),
  paths: { '@/*': ['src/*'] },
});

type AppFactory = typeof import('../src/app.factory').createShaadwoodApp;

let createShaadwoodApp: AppFactory | undefined;
let appPromise: ReturnType<AppFactory> | undefined;

export default async function handler(req: Request, res: Response) {
  try {
    createShaadwoodApp ??= require('../src/app.factory')
      .createShaadwoodApp as AppFactory;
    appPromise ??= createShaadwoodApp();

    const app = await appPromise;
    const server = app.getHttpAdapter().getInstance();

    return server(req, res);
  } catch (error) {
    console.error('Shaadwood API bootstrap failed:', error);
    return res.status(500).json({ message: 'Shaadwood API bootstrap failed' });
  }
}
