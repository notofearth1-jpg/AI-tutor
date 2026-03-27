import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { JobsController } from "./jobs.controller";

@Module({
  imports: [
    BullModule.registerQueue(
      { name: "lesson" },
      { name: "assignment" },
      { name: "grading" }
    )
  ],
  controllers: [JobsController]
})
export class JobsModule {}
