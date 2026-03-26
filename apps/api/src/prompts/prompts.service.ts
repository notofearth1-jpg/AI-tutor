import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { AGENT_PROMPTS } from "@ai-tutor/prompts";
import { PromptTemplate } from "@ai-tutor/db";

@Injectable()
export class PromptsService {
  constructor(private db: DatabaseService) {}

  async getActivePrompt(agentType: any): Promise<PromptTemplate | { promptText: string; version: string; }> {
    const template = await this.db.prisma.promptTemplate.findFirst({
      where: { agentType, active: true },
      orderBy: { version: "desc" }
    });

    if (!template) {
      // Fallback to coded defaults if DB is empty
      const defaultPrompt = AGENT_PROMPTS[agentType as keyof typeof AGENT_PROMPTS];
      if (!defaultPrompt) throw new NotFoundException(`No prompt found for ${agentType}`);
      return {
        promptText: defaultPrompt.system,
        version: "v0-hardcoded"
      };
    }

    return template;
  }

  async getAllPrompts(): Promise<PromptTemplate[]> {
    return this.db.prisma.promptTemplate.findMany({
      orderBy: [{ agentType: "asc" }, { version: "desc" }]
    });
  }

  async createPrompt(data: any): Promise<PromptTemplate> {
    if (data.active) {
      await this.db.prisma.promptTemplate.updateMany({
        where: { agentType: data.agentType },
        data: { active: false }
      });
    }
    return this.db.prisma.promptTemplate.create({ data });
  }

  async activatePrompt(id: string): Promise<PromptTemplate> {
    const target = await this.db.prisma.promptTemplate.findUnique({ where: { id } });
    if (!target) throw new NotFoundException();

    await this.db.prisma.promptTemplate.updateMany({
      where: { agentType: target.agentType },
      data: { active: false }
    });

    return this.db.prisma.promptTemplate.update({
      where: { id },
      data: { active: true }
    });
  }
}
