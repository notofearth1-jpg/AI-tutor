import { Controller, Get } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";

@Controller("health")
export class HealthController {
  constructor(private db: DatabaseService) {}

  @Get()
  async getHealth() {
    return { status: "ok", timestamp: new Date().toISOString() };
  }

  @Get("ready")
  async getReady() {
    try {
      await this.db.prisma.$queryRaw`SELECT 1`;
      return { status: "ready", services: { db: "ok" } };
    } catch {
      return { status: "unready", services: { db: "down" } };
    }
  }
}
