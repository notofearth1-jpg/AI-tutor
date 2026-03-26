import { Controller, Get, Post, Patch, Body, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { PromptsService } from "./prompts.service";

@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("admin", "content_manager")
@Controller("prompts")
export class PromptsController {
  constructor(private promptsService: PromptsService) {}

  @Get()
  async getAll() {
    return this.promptsService.getAllPrompts();
  }

  @Post()
  async create(@Body() body: any) {
    return this.promptsService.createPrompt(body);
  }

  @Patch(":id/activate")
  async activate(@Param("id") id: string) {
    return this.promptsService.activatePrompt(id);
  }
}
