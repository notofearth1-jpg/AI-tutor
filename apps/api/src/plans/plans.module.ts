import { Module } from "@nestjs/common";
import { PlansService } from "./plans.service";
import { PlansController } from "./plans.controller";
import { AgentsModule } from "../agents/agents.module";
import { StudentsModule } from "../students/students.module";

@Module({
  imports: [AgentsModule, StudentsModule],
  controllers: [PlansController],
  providers: [PlansService]
})
export class PlansModule {}
