import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { LessonsService } from "./lessons.service";
import { GetUser } from "../auth/get-user.decorator";

@UseGuards(AuthGuard("jwt"))
@Controller("lessons")
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Get(":id")
  async getLesson(@Param("id") id: string) {
    return this.lessonsService.getLesson(id);
  }

  @Post()
  async createLesson(@GetUser() user: any, @Body() body: any) {
    return this.lessonsService.startLessonGeneration(user.id, body.topicSlug);
  }
}
