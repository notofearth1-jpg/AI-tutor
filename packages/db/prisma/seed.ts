import { PrismaClient, Difficulty, AgentType } from "../generated-client";
import { AGENT_PROMPTS } from "@ai-tutor/prompts";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding AI Tutor Basics (Multi-Step Edition)...");

  // 1. Seed Topics
  const topics = [
    {
      slug: "intro-to-llms",
      title: "Introduction to Large Language Models",
      description: "Learn what LLMs are, how they work, and why they are transforming the digital world.",
      difficulty: "beginner" as Difficulty,
      estimatedMinutes: 30
    },
    {
      slug: "prompt-engineering-101",
      title: "Prompt Engineering Basics",
      description: "Master the fundamental techniques of writing effective prompts for AI agents.",
      difficulty: "beginner" as Difficulty,
      estimatedMinutes: 45
    },
    {
      slug: "advanced-prompt-techniques",
      title: "Advanced Prompting Patterns",
      description: "Explore Chain-of-Thought, Few-Shot, and Self-Reflection techniques for complex tasks.",
      difficulty: "intermediate" as Difficulty,
      estimatedMinutes: 60
    },
    {
      slug: "ai-safety-and-ethics",
      title: "AI Safety & Ethics",
      description: "Understand the responsible use of AI, including bias, safety guardrails, and transparency.",
      difficulty: "beginner" as Difficulty,
      estimatedMinutes: 30
    },
    {
      slug: "building-ai-apps",
      title: "Building Real-World AI Apps",
      description: "Learn how to integrate LLMs into production applications using specialized SDKs and APIs.",
      difficulty: "advanced" as Difficulty,
      estimatedMinutes: 90
    }
  ];

  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { slug: topic.slug },
      update: topic,
      create: topic
    });
  }
  console.log("✅ Seeded Topics");

  // 2. Seed Prompt Templates
  const agents = Object.keys(AGENT_PROMPTS);
  for (const agentKey of agents) {
    const prompt = (AGENT_PROMPTS as any)[agentKey];
    await prisma.promptTemplate.upsert({
      where: {
        agentType_version: {
          agentType: agentKey as AgentType,
          version: "v1.0.0"
        }
      },
      update: {
        promptText: prompt.system,
        active: true
      },
      create: {
        agentType: agentKey as AgentType,
        version: "v1.0.0",
        promptText: prompt.system,
        responseSchema: {},
        active: true
      }
    });
  }
  console.log("✅ Seeded Prompt Templates");

  console.log("🚀 Seeding Complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
