import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class AssignmentsService {
  constructor(
    @InjectQueue("assignment") private assignmentQueue: Queue,
    @InjectQueue("grading") private gradingQueue: Queue,
    private db: DatabaseService
  ) {}

  async getAssignment(id: string) {
    const assignment = await this.db.prisma.assignment.findUnique({
      where: { id }
    });
    if (!assignment) throw new NotFoundException("Assignment not found");
    return assignment;
  }

  async startAssignmentGeneration(userId: string, lessonId: string) {
    const job = await this.assignmentQueue.add("generate-assignment", {
      userId,
      lessonId
    });
    return { jobId: job.id, status: "queued" };
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
