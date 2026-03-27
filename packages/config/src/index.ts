import { z } from "zod";
import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

function findRoot(startDir: string): string {
  let currentDir = startDir;
  while (currentDir !== path.parse(currentDir).root) {
    if (fs.existsSync(path.join(currentDir, "pnpm-workspace.yaml"))) {
      return currentDir;
    }
    currentDir = path.dirname(currentDir);
  }
  return startDir;
}

const rootDir = findRoot(__dirname);
const envPath = path.join(rootDir, ".env");

// Load from root
dotenv.config({ path: envPath });

console.log(`📂 Loading configuration from: ${envPath}`);
if (!fs.existsSync(envPath)) {
  console.warn(`⚠️ Warning: .env file not found at ${envPath}`);
}

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  
  // Cloud-ready URLs
  DATABASE_URL: z.string().url().describe("PostgreSQL connection string with sslmode=require"),
  REDIS_URL: z.string().url().describe("Redis connection string. Use rediss:// for cloud TLS"),
  
  GEMINI_API_KEY: z.string().min(1),
  GEMINI_MODEL_FLASH: z.string().default("gemini-2.0-flash"),
  GEMINI_MODEL_PRO: z.string().default("gemini-pro-latest"),
  
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  
  PORT: z.string().transform(Number).optional(),
  PORT_API: z.string().transform(Number).default("4000"),
  PORT_WEB: z.string().transform(Number).default("3000"),
  
  NEXT_PUBLIC_API_BASE_URL: z.string().describe("The base URL of the API. Can be a full URL (https://...) or a hostname."),
  CORS_ALLOWED_ORIGINS: z.string().optional().describe("Comma-separated list of allowed origins. Defaults are http://localhost:3000,https://ai-tutor-web-omega.vercel.app."),

  COOKIE_DOMAIN: z.string().default("localhost"),
  COOKIE_SECURE: z.string().transform((v) => v === "true").default("false"),
  
  SENTRY_DSN: z.string().optional(),
  POSTHOG_KEY: z.string().optional(),
  POSTHOG_HOST: z.string().optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Environment validation failed:");
  console.error(JSON.stringify(parsed.error.format(), null, 2));
  
  if (process.env.NODE_ENV === "production" || process.env.RAILWAY_ENVIRONMENT) {
    console.warn("⚠️ Continuing anyway for cloud deployment diagnostic. Some features will fail.");
  } else {
    process.exit(1);
  }
}

// Fallback logic for values that are missing during partial failure
export const env = (parsed.success ? parsed.data : process.env) as any;
