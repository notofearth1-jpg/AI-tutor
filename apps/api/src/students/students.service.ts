import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { StudentProfile, TopicMastery } from "@ai-tutor/db";

@Injectable()
export class StudentsService {
  constructor(private db: DatabaseService) {}

  async getProfile(userId: string): Promise<StudentProfile> {
    const profile = await this.db.prisma.studentProfile.findUnique({
      where: { userId }
    });
    if (!profile) throw new NotFoundException("Profile not found");
    return profile;
  }

  async createProfile(userId: string, data: any): Promise<StudentProfile> {
    return this.db.prisma.studentProfile.upsert({
      where: { userId },
      update: data,
      create: { ...data, userId }
    });
  }

  async getMastery(userId: string): Promise<TopicMastery[]> {
    const profile = await this.getProfile(userId);
    return this.db.prisma.topicMastery.findMany({
      where: { profileId: profile.id }
    });
  }
}
