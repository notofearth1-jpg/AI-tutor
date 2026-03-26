import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ProgressService } from "./progress.service";
import { TopicMastery, Submission, Assignment, Grade } from "@ai-tutor/db";

@UseGuards(AuthGuard("jwt"))
@Controller("progress")
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get(":userId")
  async getProgress(@Param("userId") userId: string): Promise<{
    mastery: TopicMastery[];
    submissions: (Submission & { assignment: Assignment | null; grade: Grade | null })[];
  }> {
    return this.progressService.getUserProgress(userId);
  }
}
