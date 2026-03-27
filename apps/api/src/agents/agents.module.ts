import { Module } from "@nestjs/common";
import { AgentOrchestratorService } from "./orchestrator.service";
import { PromptsModule } from "../prompts/prompts.module";
import { SafetyModule } from "../common/safety.module";
import { AnalyticsModule } from "../common/analytics.module";

@Module({
  imports: [PromptsModule, SafetyModule, AnalyticsModule],
  providers: [AgentOrchestratorService],
  exports: [AgentOrchestratorService]
})
export class AgentsModule {}
