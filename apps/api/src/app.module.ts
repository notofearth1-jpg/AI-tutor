import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { AuthModule } from "./auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { HealthController } from "./health/health.controller";
import { StudentsModule } from "./students/students.module";
import { PlansModule } from "./plans/plans.module";
import { LessonsModule } from "./lessons/lessons.module";
import { AssignmentsModule } from "./assignments/assignments.module";
import { ProgressModule } from "./progress/progress.module";
import { AgentsModule } from "./agents/agents.module";
import { PromptsModule } from "./prompts/prompts.module";
import { AdminModule } from "./admin/admin.module";
import { SafetyModule } from "./common/safety.module";
import { AnalyticsModule } from "./common/analytics.module";
import { LoggingModule } from "./common/logging.module";
import { env } from "@ai-tutor/config";

@Module({
  imports: [
    // Global BullMQ Connection for API Producers
    BullModule.forRoot({
      connection: {
        url: env.REDIS_URL,
        // Support rediss:// for Upstash/Cloud Redis
        tls: env.REDIS_URL?.startsWith('rediss://') ? {} : undefined,
      }
    }),
    DatabaseModule,
    LoggingModule,
    SafetyModule,
    AnalyticsModule,
    AuthModule,
    StudentsModule,
    PlansModule,
    LessonsModule,
    AssignmentsModule,
    ProgressModule,
    AgentsModule,
    PromptsModule,
    AdminModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
