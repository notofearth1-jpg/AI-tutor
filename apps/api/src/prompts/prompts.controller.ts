import { Controller, Get, Post, Patch, Body, Param, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { PromptsService } from "./prompts.service";
import { PromptTemplate } from "@ai-tutor/db";

@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("admin", "content_manager")
@Controller("prompts")
export class PromptsController {
  constructor(private promptsService: PromptsService) {}

  @Get()
  async getAll(): Promise<PromptTemplate[]> {
    return this.promptsService.getAllPrompts();
  }

  @Post()
  async create(@Body() body: any): Promise<PromptTemplate> {
    return this.promptsService.createPrompt(body);
  }

  @Patch(":id/activate")
  async activate(@Param("id") id: string): Promise<PromptTemplate> {
    return this.promptsService.activatePrompt(id);
  }
}
