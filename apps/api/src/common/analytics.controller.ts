import { Body, Controller, Post } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  /**
   * Public endpoint — no auth required so the frontend can track events
   * before a user is logged in (e.g. homepage_viewed).
   * POST /api/analytics/track
   */
  @Post("track")
  async track(@Body() body: { eventName: string; properties?: Record<string, unknown> }) {
    return this.analyticsService.trackEvent(null, body.eventName, body.properties);
  }
}
