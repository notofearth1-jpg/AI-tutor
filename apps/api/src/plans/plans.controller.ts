import { Controller, Get, Post, Body, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { PlansService } from "./plans.service";
import { GetUser } from "../auth/get-user.decorator";

@UseGuards(AuthGuard("jwt"))
@Controller("plans")
export class PlansController {
  constructor(private plansService: PlansService) {}

  @Get(":userId")
  async getPlan(@Param("userId") userId: string) {
    return this.plansService.getPlanForUser(userId);
  }

  @Post()
  async generatePlan(@GetUser() user: any) {
    return this.plansService.generatePlan(user.id);
  }
}
