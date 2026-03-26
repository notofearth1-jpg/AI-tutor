# 🚀 Deployment Guide - AI Tutor Platform

This guide covers offloading your local infrastructure to cloud services and deploying the platform online for production use.

## 1. Database Setup (PostgreSQL)

**Provider**: [Neon.tech](https://neon.tech) (Recommended) or [Supabase](https://supabase.com).

1.  Create a new project named `ai-tutor`.
2.  Navigate to the **Connection Details** section.
3.  Copy the **Connection String**.
4.  **Crucial**: Ensure it ends with `?sslmode=require`.
5.  Update your `.env`:
    ```env
    DATABASE_URL="postgresql://alex:password@ep-cool-ice-1234.us-east-2.aws.neon.tech/neondb?sslmode=require"
    ```

## 2. Queue & Cache Setup (Redis)

**Provider**: [Upstash](https://upstash.com).

1.  Create a new Redis database named `ai-tutor-queue`.
2.  Under the **Connect to your database** section, copy the **Redis URL**.
3.  Ensure the protocol is `rediss://` (the extra 's' is for TLS/SSL).
4.  Update your `.env`:
    ```env
    REDIS_URL="rediss://default:yourpassword@your-host.upstash.io:6379"
    ```

## 3. Backend API & Worker Deployment

**Provider**: [Railway.app](https://railway.app) (Recommended) or [Render.com](https://render.com).

### Railway Setup:
1.  Connect your GitHub repository.
2.  **Add Service**: Root of the repo.
3.  **Variables**: Add all variables from your `.env`.
4.  **Service 1 (API)**:
    - Build Command: `pnpm install && pnpm build`
    - Start Command: `pnpm --filter @ai-tutor/api start`
    - Custom Domain: Railway will provide a URL (e.g., `ai-tutor-api.up.railway.app`). Update `NEXT_PUBLIC_API_BASE_URL` in your env with this.
5.  **Service 2 (Worker)**:
    - Build Command: `pnpm install && pnpm build`
    - Start Command: `pnpm --filter @ai-tutor/worker start`

## 4. Frontend Deployment

**Provider**: [Vercel](https://vercel.com).

1.  Import your GitHub repository.
2.  Select `apps/web` as the root directory (or use the monorepo preset).
3.  **Framework Preset**: Next.js.
4.  **Environment Variables**:
    - `NEXT_PUBLIC_API_BASE_URL`: (The URL of your Railway API).
    - `GEMINI_API_KEY`: (Needed if any client-side AI features are used).
5.  Click **Deploy**.

## 5. Post-Deployment Verification

1.  **Migrate DB**: Run this command locally (pointing to the Cloud DB via your local env):
    ```bash
    pnpm prisma migrate deploy
    ```
2.  **Seed Data**:
    ```bash
    pnpm prisma db seed
    ```
3.  **Health Check**: Visit `https://your-api.com/api/health`.

---

### Low RAM Developing Tip
Once you've moved to cloud services, you can stop the Docker Desktop app completely and just run:
`pnpm dev --filter @ai-tutor/*`
This will only run the Node.js processes, which use significantly less RAM than Dockerized Postgres and Redis.
