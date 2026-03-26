import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { StudentsService } from "../students/students.service";
import { TopicMastery, Submission, Assignment, Grade } from "@ai-tutor/db";

@Injectable()
export class ProgressService {
  constructor(
    private db: DatabaseService,
    private students: StudentsService
  ) {}

  async getUserProgress(userId: string): Promise<{
    mastery: TopicMastery[];
    submissions: (Submission & { assignment: Assignment | null; grade: Grade | null })[];
  }> {
    const profile = await this.students.getProfile(userId);
    const mastery = await this.db.prisma.topicMastery.findMany({
      where: { profileId: profile.id }
    });
    const submissions = await this.db.prisma.submission.findMany({
      where: { userId },
      include: { assignment: true, grade: true },
      orderBy: { submittedAt: "desc" },
      take: 10
    });

    return { mastery, submissions };
  }
}
