import type { Request, Response } from 'express';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { register } from 'tsconfig-paths';

void NestFactory;

// The complete Nest application is compiled by `nest build` into dist/.
// Resolve the project's @/* imports against that compiled output.
register({
  baseUrl: process.cwd(),
  paths: { '@/*': ['dist/*'] },
});

type AppFactory = () => Promise<NestExpressApplication>;

let createShaadwoodApp: AppFactory | undefined;
let appPromise: ReturnType<AppFactory> | undefined;

export default async function handler(req: Request, res: Response) {
  try {
    createShaadwoodApp ??= require('../dist/app.factory')
      .createShaadwoodApp as AppFactory;
    appPromise ??= createShaadwoodApp();

    const app = await appPromise;
    const server = app.getHttpAdapter().getInstance();

    return server(req, res);
  } catch (error) {
    console.error('Shaadwood API bootstrap failed:', error);
    return res.status(500).json({
      message: 'Shaadwood API bootstrap failed',
      detail: error instanceof Error ? error.message : String(error),
    });
  }
}
