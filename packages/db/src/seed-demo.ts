import { PrismaClient } from "@prisma/client";
import { DEFAULT_TOPICS } from "@ai-tutor/prompts";
import { AGENT_PROMPTS } from "@ai-tutor/prompts";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding demo data...");

  // 1. Create Topics
  for (const topic of DEFAULT_TOPICS) {
    await prisma.topic.upsert({
      where: { slug: topic.slug },
      update: {},
      create: {
        slug: topic.slug,
        title: topic.title,
        description: topic.description,
        difficulty: topic.difficulty as any,
        estimatedMinutes: topic.estimatedMinutes
      }
    });
  }

  // 2. Create Prompt Templates
  for (const [agentType, prompts] of Object.entries(AGENT_PROMPTS)) {
    await prisma.promptTemplate.upsert({
      where: {
        agentType_version: {
          agentType: agentType as any,
          version: "v1"
        }
      },
      update: {},
      create: {
        agentType: agentType as any,
        version: "v1",
        promptText: prompts.system,
        responseSchema: {}, // Optional in seed
        active: true
      }
    });
  }

  // 3. Create Demo Users
  const passwordHash = "$2b$10$Ep76J5K98E8scS8hK.KqMe0K.6/bY1T2o8k8v.k8s.k8s.k8s.k8s"; // Password123 (demo)

  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      passwordHash,
      role: "admin"
    }
  });

  const student = await prisma.user.upsert({
    where: { email: "student@example.com" },
    update: {},
    create: {
      email: "student@example.com",
      passwordHash,
      role: "student"
    }
  });

  // Create profile for student
  await prisma.studentProfile.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      fullName: "Demo Student",
      ageRange: "25-34",
      educationBackground: "Bachelor in Computer Science",
      goals: "Understand AI Agents better",
      selfReportedLevel: "beginner",
      preferredLanguage: "en",
      preferredLearningStyle: "mixed",
      knownTopics: ["basics-of-programming"]
    }
  });

  console.log("✅ Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
