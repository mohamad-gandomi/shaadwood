import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    // Serverless functions should connect lazily on the first query. An eager
    // connection makes the whole function fail during a transient DB delay.
    if (!process.env.VERCEL) {
      await this.$connect();
    }
  }

  async onModuleDestroy() {
    if (!process.env.VERCEL) {
      await this.$disconnect();
    }
  }
}
