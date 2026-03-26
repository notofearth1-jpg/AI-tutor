import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { AdminService } from "./admin.service";
import { User, AgentRun, AnalyticsEvent } from "@ai-tutor/db";

@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("admin", "ai_ops", "content_manager")
@Controller("admin")
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get("users")
  async getUsers(@Query("limit") limit?: string): Promise<(User & { studentProfile: any | null })[]> {
    return this.adminService.getUsers(limit ? parseInt(limit) : undefined);
  }

  @Get("agent-runs")
  async getAgentRuns(@Query("limit") limit?: string): Promise<AgentRun[]> {
    return this.adminService.getAgentRuns(limit ? parseInt(limit) : undefined);
  }

  @Get("analytics-events")
  async getAnalyticsEvents(@Query("limit") limit?: string): Promise<AnalyticsEvent[]> {
    return this.adminService.getAnalyticsEvents(limit ? parseInt(limit) : undefined);
  }

  @Get("agent-costs")
  async getAgentCosts(): Promise<Record<string, any>> {
    return this.adminService.getAgentCosts();
  }
}
