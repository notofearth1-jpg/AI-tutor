# Stage 1: Builder
FROM node:20-slim AS builder
WORKDIR /app

# Install build tools for native dependencies like bcrypt
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Install pnpm
RUN npm install -g pnpm

# Copy workspace configuration and lockfiles
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/api/package.json ./apps/api/
COPY apps/worker/package.json ./apps/worker/
COPY packages/types/package.json ./packages/types/
COPY packages/config/package.json ./packages/config/
COPY packages/db/package.json ./packages/db/
COPY packages/prompts/package.json ./packages/prompts/
COPY packages/agent-sdk/package.json ./packages/agent-sdk/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source and build
COPY . .
RUN pnpm run build --filter @ai-tutor/api

# Stage 2: Runner
FROM node:20-slim
WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages ./packages

# Production install
RUN pnpm install --prod --no-frozen-lockfile

EXPOSE 4000
CMD ["node", "apps/api/dist/main"]
