import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { LessonProcessor, AssignmentProcessor, GradingProcessor } from "./processors";
import { env } from "@ai-tutor/config";
import { DatabaseModule } from "../../api/src/database/database.module";
import { AgentsModule } from "../../api/src/agents/agents.module";
import { PromptsModule } from "../../api/src/prompts/prompts.module";

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        url: env.REDIS_URL,
        // Cloud providers like Upstash require TLS for rediss://
        tls: env.REDIS_URL.startsWith('rediss://') ? {} : undefined,
      }
    }),
    DatabaseModule,
    AgentsModule,
    PromptsModule
  ],
  providers: [LessonProcessor, AssignmentProcessor, GradingProcessor]
})
export class WorkerModule {}
