import { Controller, Post, Body, Res, UseGuards, Get, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response, Request } from "express";
import { AuthGuard } from "@nestjs/passport";
import { GetUser } from "./get-user.decorator";
import { env } from "@ai-tutor/config";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  async signUp(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const data = await this.authService.signUp(body.email, body.password, body.role);
    this.setCookies(res, data.accessToken, data.refreshToken);
    return { id: data.id, email: data.email, role: data.role, accessToken: data.accessToken };
  }

  @Post("login")
  async login(@Body() body: any, @Res({ passthrough: true }) res: Response) {
    const data = await this.authService.login(body.email, body.password);
    this.setCookies(res, data.accessToken, data.refreshToken);
    return { ...data.user, accessToken: data.accessToken };
  }

  @Post("logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    const isProd = process.env.NODE_ENV === "production" || !!process.env.RAILWAY_ENVIRONMENT;
    const common = {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? ("none" as const) : ("lax" as const),
      path: "/",
    };
    res.clearCookie("accessToken", common);
    res.clearCookie("refreshToken", common);
    return { success: true };
  }

  @UseGuards(AuthGuard("jwt-refresh"))
  @Post("refresh")
  async refresh(@GetUser() user: any, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.refresh(user.id, user.role);
    this.setCookies(res, tokens.accessToken, tokens.refreshToken);
    return { success: true };
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  async me(@GetUser() user: any) {
    return user;
  }

  private setCookies(res: Response, access: string, refresh: string) {
    const isProd = process.env.NODE_ENV === "production" || !!process.env.RAILWAY_ENVIRONMENT;
    
    const common = {
      httpOnly: true,
      secure: isProd, // Must be true for SameSite=none
      sameSite: isProd ? ("none" as const) : ("lax" as const),
      path: "/",
    };

    res.cookie("accessToken", access, { ...common, maxAge: 15 * 60 * 1000 });
    res.cookie("refreshToken", refresh, { ...common, maxAge: 7 * 24 * 60 * 60 * 1000 });
  }
}
