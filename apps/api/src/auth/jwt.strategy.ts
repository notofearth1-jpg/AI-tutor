import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { env } from "@ai-tutor/config";
import { DatabaseService } from "../database/database.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(private db: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: any) => {
          let token = null;
          // 1. Try Cookies
          if (req?.cookies?.accessToken) token = req.cookies.accessToken;
          // 2. Try Headers
          const authHeader = req.headers?.authorization;
          if (!token && authHeader?.toLowerCase().startsWith("bearer ")) {
            token = authHeader.substring(7).trim();
          }

          if (process.env.NODE_ENV !== "test") {
            const hasToken = !!token;
            console.log(`🔐 [JwtStrategy] Auth check: { hasToken: ${hasToken}, headerPresent: ${!!authHeader} }`);
          }

          return token || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        }
      ]),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET
    });
  }

  async validate(payload: any) {
    const user = await this.db.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) throw new UnauthorizedException();
    return { id: user.id, email: user.email, role: user.role };
  }
}
