import { Module } from "@nestjs/common";
import { ProgressService } from "./progress.service";
import { ProgressController } from "./progress.controller";
import { StudentsModule } from "../students/students.module";

@Module({
  imports: [StudentsModule],
  controllers: [ProgressController],
  providers: [ProgressService]
})
export class ProgressModule {}
