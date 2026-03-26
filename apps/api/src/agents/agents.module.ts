import { Module } from "@nestjs/common";
import { AgentOrchestratorService } from "./orchestrator.service";
import { PromptsModule } from "../prompts/prompts.module";

@Module({
  imports: [PromptsModule],
  providers: [AgentOrchestratorService],
  exports: [AgentOrchestratorService]
})
export class AgentsModule {}
