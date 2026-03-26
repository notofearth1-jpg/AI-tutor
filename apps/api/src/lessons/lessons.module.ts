import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { LessonsService } from "./lessons.service";
import { LessonsController } from "./lessons.controller";
import { AgentsModule } from "../agents/agents.module";
import { StudentsModule } from "../students/students.module";

@Module({
  imports: [
    AgentsModule,
    StudentsModule,
    BullModule.registerQueue({ name: "lesson" })
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService]
})
export class LessonsModule {}
