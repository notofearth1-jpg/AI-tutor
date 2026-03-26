# Stage 1: Builder
FROM node:20-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

# 1. CORE WORKSPACE CONFIG
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# 2. ALL PACKAGE DESCRIPTORS (SINGLE BLOCK)
# Using explicit targets to ensure paths are created correctly
COPY apps/api/package.json apps/api/package.json
COPY apps/worker/package.json apps/worker/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/db/package.json packages/db/package.json
COPY packages/prompts/package.json packages/prompts/package.json
COPY packages/agent-sdk-lib/package.json packages/agent-sdk-lib/package.json

RUN pnpm install --frozen-lockfile

# 3. SOURCE AND BUILD
COPY . .
RUN pnpm run build --filter @ai-tutor/worker

# Stage 2: Runner
FROM node:20-slim
WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --from=builder /app/apps/worker/package.json ./apps/worker/
COPY --from=builder /app/apps/worker/dist ./apps/worker/dist
COPY --from=builder /app/packages ./packages

RUN pnpm install --prod --no-frozen-lockfile

CMD ["node", "apps/worker/dist/apps/worker/src/main"]
