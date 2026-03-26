import { Injectable, NotFoundException } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";
import { StudentProfile } from "@ai-tutor/types";

@Injectable()
export class StudentsService {
  constructor(private db: DatabaseService) {}

  async getProfile(userId: string) {
    const profile = await this.db.prisma.studentProfile.findUnique({
      where: { userId }
    });
    if (!profile) throw new NotFoundException("Profile not found");
    return profile;
  }

  async createProfile(userId: string, data: any) {
    return this.db.prisma.studentProfile.upsert({
      where: { userId },
      update: data,
      create: { ...data, userId }
    });
  }

  async getMastery(userId: string) {
    const profile = await this.getProfile(userId);
    return this.db.prisma.topicMastery.findMany({
      where: { profileId: profile.id }
    });
  }
}
