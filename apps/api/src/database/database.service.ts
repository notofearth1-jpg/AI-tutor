import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { prisma, PrismaClient } from "@ai-tutor/db";

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  get prisma(): PrismaClient {
    return prisma;
  }

  async onModuleInit() {
    await prisma.$connect();
  }

  async onModuleDestroy() {
    await prisma.$disconnect();
  }
}
