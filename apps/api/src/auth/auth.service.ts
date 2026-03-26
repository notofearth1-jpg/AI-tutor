import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DatabaseService } from "../database/database.service";
import * as bcrypt from "bcrypt";
import { env } from "@ai-tutor/config";

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwtService: JwtService
  ) {}

  async signUp(email: string, passwordHash: string, role: any) {
    const existing = await this.db.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException("User already exists");

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(passwordHash, salt);

    return this.db.prisma.user.create({
      data: { email, passwordHash: hash, role },
      select: { id: true, email: true, role: true }
    });
  }

  async login(email: string, passwordHash: string) {
    const user = await this.db.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException("Invalid credentials");

    const isMatch = await bcrypt.compare(passwordHash, user.passwordHash);
    if (!isMatch) throw new UnauthorizedException("Invalid credentials");

    const tokens = await this.generateTokens(user.id, user.role);
    return { user: { id: user.id, email: user.email, role: user.role }, ...tokens };
  }

  async generateTokens(userId: string, role: string) {
    const payload = { sub: userId, role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: env.JWT_REFRESH_SECRET,
      expiresIn: "7d"
    });
    return { accessToken, refreshToken };
  }

  async refresh(userId: string, role: string) {
    return this.generateTokens(userId, role);
  }
}
