import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { DatabaseService } from "../database/database.service";
import { Assignment } from "@ai-tutor/db";

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectQueue("assignment") private assignmentQueue: Queue,
    @InjectQueue("grading") private gradingQueue: Queue,
    private db: DatabaseService
  ) {}

  async getAssignment(id: string): Promise<Assignment> {
    const assignment = await this.db.prisma.assignment.findUnique({
      where: { id }
    });
    if (!assignment) throw new NotFoundException("Assignment not found");
    return assignment;
  }

  async startAssignmentGeneration(userId: string, lessonId: string) {
    // Check if lesson exists
    const lesson = await this.db.prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) throw new NotFoundException("Lesson not found");

    // Create Skeleton Assignment
    const assignment = await this.db.prisma.assignment.create({
      data: {
        lessonId,
        title: "Generating Assignment...",
        instructions: "The Invigilator Agent is preparing your questions. Please wait 15-30 seconds.",
        questions: [],
        metadata: { status: "generating" }
      }
    });

    await this.assignmentQueue.add("generate-assignment", {
      userId,
      lessonId,
      assignmentId: assignment.id
    });

    return { id: assignment.id, status: "generating" };
  }

  async submitAssignment(userId: string, assignmentId: string, answers: any[]) {
    const submission = await this.db.prisma.submission.create({
      data: {
        userId,
        assignmentId,
        answers: answers as any
      }
    });

    const job = await this.gradingQueue.add("grade-submission", {
      submissionId: submission.id
    });

    return { submissionId: submission.id, jobId: job.id, status: "queued" };
  }
}
