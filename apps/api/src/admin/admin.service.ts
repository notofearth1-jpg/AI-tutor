import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { User, AgentRun, AnalyticsEvent } from "@ai-tutor/db";

@Injectable()
export class AdminService {
  constructor(private db: DatabaseService) {}

  async getUsers(limit = 50): Promise<(User & { studentProfile: any | null })[]> {
    return this.db.prisma.user.findMany({
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { studentProfile: true }
    });
  }

  async getAgentRuns(limit = 50): Promise<AgentRun[]> {
    return this.db.prisma.agentRun.findMany({
      take: limit,
      orderBy: { createdAt: "desc" }
    });
  }

  async getAnalyticsEvents(limit = 100): Promise<AnalyticsEvent[]> {
    return this.db.prisma.analyticsEvent.findMany({
      take: limit,
      orderBy: { createdAt: "desc" }
    });
  }

  async getAgentCosts(): Promise<Record<string, any>> {
    const runs = await this.db.prisma.agentRun.findMany({
      select: { agentType: true, modelUsed: true, tokenUsage: true, costEstimate: true }
    });

    const stats: Record<string, any> = {};
    for (const run of runs) {
      const key = `${run.agentType}_${run.modelUsed}`;
      if (!stats[key]) stats[key] = { totalCost: 0, totalTokens: 0, count: 0 };
      stats[key].totalCost += run.costEstimate;
      stats[key].totalTokens += run.tokenUsage;
      stats[key].count += 1;
    }
    return stats;
  }
}
