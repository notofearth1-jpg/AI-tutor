import { z } from "zod";
import * as dotenv from "dotenv";
import * as path from "path";

// Load from root
dotenv.config({ path: path.join(__dirname, "../../../.env") });

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  
  // Cloud-ready URLs
  DATABASE_URL: z.string().url().describe("PostgreSQL connection string with sslmode=require"),
  REDIS_URL: z.string().url().describe("Redis connection string. Use rediss:// for cloud TLS"),
  
  GEMINI_API_KEY: z.string().min(1),
  GEMINI_MODEL_FLASH: z.string().default("gemini-1.5-flash"),
  GEMINI_MODEL_PRO: z.string().default("gemini-1.5-pro"),
  
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  
  PORT_API: z.string().transform(Number).default("4000"),
  PORT_WEB: z.string().transform(Number).default("3000"),
  
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  
  COOKIE_DOMAIN: z.string().default("localhost"),
  COOKIE_SECURE: z.string().transform((v) => v === "true").default("false"),
  
  SENTRY_DSN: z.string().optional(),
  POSTHOG_KEY: z.string().optional(),
  POSTHOG_HOST: z.string().optional()
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;
