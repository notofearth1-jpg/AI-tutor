import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AssignmentsService } from "./assignments.service";
import { GetUser } from "../auth/get-user.decorator";
import { Assignment } from "@ai-tutor/db";

@UseGuards(AuthGuard("jwt"))
@Controller("assignments")
export class AssignmentsController {
  constructor(private assignmentsService: AssignmentsService) {}

  @Get(":id")
  async getAssignment(@Param("id") id: string): Promise<Assignment> {
    return this.assignmentsService.getAssignment(id);
  }

  @Post()
  async createAssignment(@GetUser() user: any, @Body() body: any) {
    return this.assignmentsService.startAssignmentGeneration(user.id, body.lessonId);
  }

  @Post("submit")
  async submitAssignment(@GetUser() user: any, @Body() body: any) {
    return this.assignmentsService.submitAssignment(user.id, body.assignmentId, body.answers);
  }
}
