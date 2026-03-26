import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { DatabaseService } from "../database/database.service";
import { toPrismaTopicSlug } from "../common/topic-slug.mapper";

@Injectable()
export class LessonsService {
  constructor(
    @InjectQueue("lesson") private lessonQueue: Queue,
    private db: DatabaseService
  ) {}

  async getLesson(id: string) {
    const lesson = await this.db.prisma.lesson.findUnique({
      where: { id },
      include: { topic: true }
    });
    if (!lesson) throw new NotFoundException("Lesson not found");
    return lesson;
  }

  async startLessonGeneration(userId: string, topicSlug: string) {
    const prismaSlug = toPrismaTopicSlug(topicSlug);
    const topic = await this.db.prisma.topic.findUnique({ where: { slug: prismaSlug } });
    if (!topic) throw new NotFoundException("Topic not found");

    const job = await this.lessonQueue.add("generate-lesson", {
      userId,
      topicSlug: prismaSlug,
      topicTitle: topic.title
    });

    return { jobId: job.id, status: "queued" };
  }
}
