import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { StudentsService } from "./students.service";
import { GetUser } from "../auth/get-user.decorator";
import { StudentProfile, TopicMastery } from "@ai-tutor/db";

@UseGuards(AuthGuard("jwt"))
@Controller("students")
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Get("profile/:id")
  async getProfile(@Param("id") id: string): Promise<StudentProfile> {
    return this.studentsService.getProfile(id);
  }

  @Post("profile")
  async upsertProfile(@GetUser() user: any, @Body() body: any): Promise<StudentProfile> {
    return this.studentsService.createProfile(user.id, body);
  }

  @Get("mastery")
  async getMastery(@GetUser() user: any): Promise<TopicMastery[]> {
    return this.studentsService.getMastery(user.id);
  }
}
