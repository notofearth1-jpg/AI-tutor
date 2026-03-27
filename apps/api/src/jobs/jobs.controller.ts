import { Controller, Get, Param, UseGuards, NotFoundException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";

@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles("admin", "ai_ops")
@Controller("jobs")
export class JobsController {
  constructor(
    @InjectQueue("lesson") private lessonQueue: Queue,
    @InjectQueue("assignment") private assignmentQueue: Queue,
    @InjectQueue("grading") private gradingQueue: Queue
  ) {}

  /**
   * GET /api/jobs/:type/:id
   * Used by the admin JobsMonitor to inspect BullMQ job state.
   * :type is one of: lesson | assignment | grading
   */
  @Get(":type/:id")
  async getJobStatus(@Param("type") type: string, @Param("id") id: string) {
    let queue: Queue;

    switch (type) {
      case "lesson":
        queue = this.lessonQueue;
        break;
      case "assignment":
        queue = this.assignmentQueue;
        break;
      case "grading":
        queue = this.gradingQueue;
        break;
      default:
        throw new NotFoundException(`Unknown job type: ${type}. Must be one of: lesson, assignment, grading`);
    }

    const job = await queue.getJob(id);
    if (!job) throw new NotFoundException(`Job ${id} not found in ${type} queue`);

    const state = await job.getState();

    return {
      id: job.id,
      type,
      state,
      data: job.data,
      progress: job.progress,
      returnvalue: job.returnvalue,
      failedReason: job.failedReason,
      attemptsMade: job.attemptsMade,
      timestamp: job.timestamp,
      processedOn: job.processedOn,
      finishedOn: job.finishedOn
    };
  }
}
