import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { AssignmentsService } from "./assignments.service";
import { AssignmentsController } from "./assignments.controller";
import { AgentsModule } from "../agents/agents.module";

@Module({
  imports: [
    AgentsModule,
    BullModule.registerQueue({ name: "assignment" }, { name: "grading" })
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService],
  exports: [AssignmentsService]
})
export class AssignmentsModule {}
