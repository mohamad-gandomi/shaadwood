import type { Request, Response } from 'express';
import { createShaadwoodApp } from '../src/app.factory';

let appPromise: ReturnType<typeof createShaadwoodApp> | undefined;

export default async function handler(req: Request, res: Response) {
  appPromise ??= createShaadwoodApp();
  const app = await appPromise;
  const server = app.getHttpAdapter().getInstance();
  return server(req, res);
}
