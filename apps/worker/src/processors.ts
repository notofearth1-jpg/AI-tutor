import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { DatabaseService } from "../../api/src/database/database.service";
import { AgentOrchestratorService } from "../../api/src/agents/orchestrator.service";

@Processor("lesson")
export class LessonProcessor extends WorkerHost {
  constructor(
    private db: DatabaseService,
    private orchestrator: AgentOrchestratorService
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const data = job.data;
    const { userId, topicTitle, lessonId } = data;
    const topicSlug = data.topicSlug || data.prismaSlug; // Support both names for transition

    console.log(`👷 [LessonProcessor] Picking up job ${job.id} for topic: ${topicSlug}`);
    if (!topicSlug || !userId) {
      console.warn(`⚠️ [LessonProcessor] Missing critical data in job ${job.id}`, data);
    }

    try {
      // 1. Generate lesson content (Teacher Agent)
      const lessonResult = await this.orchestrator.runAgent(
        "teacher",
        { topic: topicTitle, studentLevel: "beginner" }, // Simplified for demo
        userId
      );

      // 2. Supervisor Review
      const reviewResult = await this.orchestrator.runAgent(
        "supervisor",
        { content: lessonResult },
        userId
      );

      // 3. Update in DB
      const data = {
        title: (lessonResult as any).title,
        contentMarkdown: (lessonResult as any).contentMarkdown,
        recap: (lessonResult as any).recap,
        reflectionQuestions: (lessonResult as any).reflectionQuestions,
        metadata: { 
          ...((lessonResult as any).metadata || {}), 
          supervisorNotes: (reviewResult as any).notes,
          status: "completed" 
        }
      };

      if (lessonId) {
        await this.db.prisma.lesson.update({
          where: { id: lessonId },
          data
        });
      } else {
        await this.db.prisma.lesson.create({
          data: {
            ...data,
            topicId: (await this.db.prisma.topic.findUnique({ where: { slug: topicSlug } }))!.id,
            lessonSlug: `${topicSlug}-lesson-${Date.now()}`
          }
        });
      }
    } catch (e: any) {
      console.error(`❌ Error in LessonProcessor: ${e.message}`);
      if (lessonId) {
        await this.db.prisma.lesson.update({
          where: { id: lessonId },
          data: { 
            metadata: { status: "failed", error: e.message } 
          }
        });
      }
      throw e;
    }
  }
}

@Processor("assignment")
export class AssignmentProcessor extends WorkerHost {
  constructor(
    private db: DatabaseService,
    private orchestrator: AgentOrchestratorService
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { userId, lessonId, assignmentId } = job.data;
    try {
      const lesson = await this.db.prisma.lesson.findUnique({ where: { id: lessonId } });

      const result = await this.orchestrator.runAgent(
        "invigilator",
        { lessonContent: lesson?.contentMarkdown },
        userId
      );

      const data = {
        title: `Assignment for ${lesson?.title}`,
        instructions: (result as any).instructions,
        questions: (result as any).questions,
        metadata: { 
          ...((result as any).metadata || {}), 
          status: "completed" 
        }
      };

      if (assignmentId) {
        return this.db.prisma.assignment.update({
          where: { id: assignmentId },
          data
        });
      }

      return this.db.prisma.assignment.create({
        data: {
          ...data,
          lessonId
        }
      });
    } catch (e: any) {
      console.error(`❌ Error in AssignmentProcessor: ${e.message}`);
      if (assignmentId) {
        await this.db.prisma.assignment.update({
          where: { id: assignmentId },
          data: { 
            metadata: { status: "failed", error: e.message } 
          }
        });
      }
      throw e;
    }
  }
}

@Processor("grading")
export class GradingProcessor extends WorkerHost {
  constructor(
    private db: DatabaseService,
    private orchestrator: AgentOrchestratorService
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { submissionId } = job.data;
    const sub = await this.db.prisma.submission.findUnique({
      where: { id: submissionId },
      include: { assignment: true, user: true }
    });

    const result = await this.orchestrator.runAgent(
      "progress_coach",
      {
        submission: sub?.answers,
        assignment: sub?.assignment.questions
      },
      sub?.userId
    );

    // Update Submission with grade
    await this.db.prisma.submission.update({
      where: { id: submissionId },
      data: {
        score: (result as any).score,
        feedback: (result as any).feedback,
        gradedAt: new Date()
      }
    });

    // Create Grade record
    await this.db.prisma.grade.create({
      data: {
        submissionId,
        score: (result as any).score,
        feedback: (result as any).feedback,
        strengths: (result as any).strengths,
        improvements: (result as any).improvements,
        nextRecommendedTopic: (result as any).nextRecommendedTopic
      }
    });

    // Update Topic Mastery
    const profile = await this.db.prisma.studentProfile.findUnique({
      where: { userId: sub?.userId }
    });

    if (profile) {
      const topicId = (await this.db.prisma.lesson.findUnique({
        where: { id: sub?.assignment.lessonId }
      }))?.topicId;

      if (topicId) {
        await this.db.prisma.topicMastery.upsert({
          where: { profileId_topicId: { profileId: profile.id, topicId } },
          update: {
            masteryScore: (result as any).score,
            attempts: { increment: 1 },
            lastUpdated: new Date()
          },
          create: {
            profileId: profile.id,
            topicId,
            topicSlug: "", // Could be fixed with a better mapper
            masteryScore: (result as any).score,
            attempts: 1
          }
        });
      }
    }

    return result;
  }
}
