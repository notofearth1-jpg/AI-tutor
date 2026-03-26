import { Injectable } from "@nestjs/common";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class AnalyticsService {
  constructor(private db: DatabaseService) {}

  async trackEvent(userId: string | null, eventName: string, properties?: any) {
    try {
      await this.db.prisma.analyticsEvent.create({
        data: {
          userId,
          eventName,
          properties: properties || {}
        }
      });
    } catch (err) {
      console.error("Failed to track analytics event:", err);
    }
  }
}
