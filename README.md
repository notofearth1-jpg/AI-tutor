# AI Tutor Platform

A production-ready monorepo for a multi-agent AI tutoring system powered by Google Gemini.

## Features
- Student signup and login with JWT + httpOnly cookie refresh tokens
- Student profile creation and skill assessment
- Personalised AI learning plan generation (Course Creator Agent)
- Lesson generation adapted to student level (Teacher Agent)
- Assignment generation and AI grading (Invigilator Agent)
- Output quality review (Supervisor Agent)
- Progress tracking with topic mastery scoring
- Agent run logging with cost estimation
- BullMQ worker queues for async jobs
- Admin dashboard: prompts, users, analytics, job monitor, cost summary
- Redis-distributed rate limiting
- Content safety filters
- Analytics event tracking
- Prompt registry: versioned DB-backed prompts with activation

## Stack
- Frontend: Next.js 14, Tailwind CSS, TypeScript
- Backend: NestJS, Prisma, PostgreSQL
- Workers: BullMQ + Redis
- LLM: Google Gemini (Flash + Pro)
- Auth: JWT + httpOnly refresh tokens

## Requirements
- Node 20+
- pnpm 9+
- PostgreSQL 16+
- Redis 7+
- Gemini API key (get at https://aistudio.google.com)

## Quick Start

### 1. Install dependencies
```bash
pnpm install
```

### 2. Create .env file
```bash
cp .env.example .env
# Edit .env and set GEMINI_API_KEY, JWT_SECRET, JWT_REFRESH_SECRET
```

### 3. Start infrastructure
```bash
docker-compose up -d postgres redis
```

### 4. Setup database
```bash
pnpm --filter @ai-tutor/db prisma:generate
pnpm --filter @ai-tutor/db prisma:migrate
```

### 5. Seed demo data
```bash
cd packages/db && npx ts-node src/seed-demo.ts
```

### 6. Start all services
```bash
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:4000/api
- Swagger: http://localhost:4000/api/docs

## Demo Credentials
- Student: student@example.com / Password123
- Admin: admin@example.com / Password123

## Useful Endpoints
- `GET /api/health` — basic health
- `GET /api/ready` — readiness check for DB and Redis
- `GET /api/docs` — Swagger docs
- `GET /api/jobs/lesson/:id` — lesson job status
- `GET /api/jobs/assignment/:id` — assignment job status
- `GET /api/jobs/grading/:id` — grading job status

## Testing
```bash
pnpm test
pnpm --filter @ai-tutor/api test
pnpm --filter @ai-tutor/web test
```

## Production Deployment
- Web → Vercel (see vercel.json)
- API + Worker → Railway/Render (see railway.json / render.yaml)
- DB → Supabase / Neon / RDS
- Redis → Upstash / Redis Cloud
