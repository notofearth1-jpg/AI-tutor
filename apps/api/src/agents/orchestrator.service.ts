import { Injectable } from "@nestjs/common";
import { GeminiClient, parseMarkdownJson } from "@ai-tutor/agent-sdk-lib";
import { env } from "@ai-tutor/config";
import { DatabaseService } from "../database/database.service";
import { PromptsService } from "../prompts/prompts.service";
import { SafetyService } from "../common/safety.service";
import { AnalyticsService } from "../common/analytics.service";

@Injectable()
export class AgentOrchestratorService {
  private client: GeminiClient;

  constructor(
    private db: DatabaseService,
    private promptsService: PromptsService,
    private safety: SafetyService,
    private analytics: AnalyticsService
  ) {
    this.client = new GeminiClient(
      env.GEMINI_API_KEY, 
      env.GEMINI_MODEL_FLASH, 
      env.GEMINI_MODEL_PRO
    );
  }

  async runAgent(
    agentType: any,
    variables: Record<string, any>,
    userId: string | null = null,
    options: { usePro?: boolean; skipReview?: boolean } = {}
  ) {
    const startTime = Date.now();

    // 1. Resolve prompt
    const promptTemplate = await this.promptsService.getActivePrompt(agentType);
    let systemPrompt = promptTemplate.promptText;

    // 2. Replace variables in system prompt
    for (const [key, value] of Object.entries(variables)) {
      const valStr = typeof value === "object" ? JSON.stringify(value) : String(value);
      systemPrompt = systemPrompt.replace(new RegExp(`{{${key}}}`, "g"), valStr);
    }

    // 3. Call Gemini
    const { text, usage } = await this.client.generateText(
      "Please generate the requested content according to the system instructions.",
      options.usePro,
      systemPrompt
    );

    const latencyMs = Date.now() - startTime;

    // 4. Sanitize and Parse
    let sanitized = await this.safety.screenOutput(text);
    const parsed = parseMarkdownJson(sanitized);

    // 5. Supervisor Review (Self-Correction)
    if (agentType !== "supervisor" && !options.skipReview) {
      const review = await this.runSupervisorAgent(sanitized, agentType, userId);
      if (review.approved && review.improvedOutput) {
        sanitized = typeof review.improvedOutput === "string" 
          ? review.improvedOutput 
          : JSON.stringify(review.improvedOutput);
      }
    }

    const finalParsed = parseMarkdownJson(sanitized);

    // 6. Audit log & Agent Run
    await this.db.prisma.agentRun.create({
      data: {
        userId,
        agentType,
        status: "completed",
        input: variables,
        output: finalParsed as any,
        latencyMs,
        modelUsed: options.usePro ? "gemini-1.5-pro" : "gemini-1.5-flash",
        tokenUsage: usage?.totalTokenCount || 0,
        costEstimate: this.calculateCost(usage?.totalTokenCount || 0, options.usePro),
        promptVersion: promptTemplate.version
      }
    });

    if (userId) {
      await this.analytics.trackEvent(userId, `agent_run_${agentType}`, { usage, latencyMs });
    }

    return finalParsed;
  }

  async runSupervisorAgent(rawOutput: string, originalAgent: string, userId: string | null = null) {
    const promptTemplate = await this.promptsService.getActivePrompt("supervisor");
    let systemPrompt = promptTemplate.promptText;

    systemPrompt = systemPrompt
      .replace("{{taskName}}", originalAgent)
      .replace("{{rawOutput}}", rawOutput);

    const { text } = await this.client.generateText(
      "Review the agent output for quality and consistency.",
      false, // Flash is enough for review
      systemPrompt
    );

    return parseMarkdownJson(text) as { 
      approved: boolean; 
      feedback: string; 
      improvedOutput?: any;
    };
  }

  private calculateCost(tokens: number, usePro?: boolean) {
    // Rough estimate for demo
    const rate = usePro ? 0.00002 : 0.000005;
    return tokens * rate;
  }
}
