import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ProgressService } from "./progress.service";

@UseGuards(AuthGuard("jwt"))
@Controller("progress")
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get(":userId")
  async getProgress(@Param("userId") userId: string) {
    return this.progressService.getUserProgress(userId);
  }
}
