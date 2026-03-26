import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { StudentsService } from "./students.service";
import { GetUser } from "../auth/get-user.decorator";

@UseGuards(AuthGuard("jwt"))
@Controller("students")
export class StudentsController {
  constructor(private studentsService: StudentsService) {}

  @Get("profile/:id")
  async getProfile(@Param("id") id: string) {
    return this.studentsService.getProfile(id);
  }

  @Post("profile")
  async upsertProfile(@GetUser() user: any, @Body() body: any) {
    return this.studentsService.createProfile(user.id, body);
  }

  @Get("mastery")
  async getMastery(@GetUser() user: any) {
    return this.studentsService.getMastery(user.id);
  }
}
