import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { AgentOrchestratorService } from "../agents/orchestrator.service";
import { StudentsService } from "../students/students.service";
import { CoursePlan } from "@ai-tutor/db";

@Injectable()
export class PlansService {
  constructor(
    private db: DatabaseService,
    private orchestrator: AgentOrchestratorService,
    private students: StudentsService
  ) {}

  async getPlanForUser(userId: string): Promise<CoursePlan> {
    const plan = await this.db.prisma.coursePlan.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
    if (!plan) throw new NotFoundException("No course plan found for user.");
    return plan;
  }

  async generatePlan(userId: string): Promise<CoursePlan> {
    const profile = await this.students.getProfile(userId);
    const mastery = await this.students.getMastery(userId);

    const result = await this.orchestrator.runAgent(
      "course_creator",
      {
        studentProfile: profile,
        masteredTopics: mastery.map((m: any) => m.topicSlug)
      },
      userId,
      { usePro: true }
    );

    return this.db.prisma.coursePlan.create({
      data: {
        userId,
        studentLevel: (result as any).studentLevel,
        knowledgeGaps: (result as any).knowledgeGaps || [],
        recommendedTopics: (result as any).recommendedTopics || [],
        modules: (result as any).modules
      }
    });
  }
}
