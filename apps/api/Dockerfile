FROM node:24-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS deps
WORKDIR /app
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile --filter=api

FROM deps AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY apps/api apps/api
WORKDIR /app/apps/api
RUN pnpm prisma generate
RUN pnpm build


FROM base AS runner
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
WORKDIR /app
ENV NODE_ENV=production

# installing deps to nestjs
COPY --from=deps /app/pnpm-workspace.yaml /app/pnpm-lock.yaml /app/package.json ./
COPY --from=deps /app/apps/api/package.json apps/api/
RUN pnpm install --frozen-lockfile --filter=api --prod
# add builded files
COPY --from=builder /app/apps/api/dist ./apps/api/dist
# prisma files 
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/apps/api/prisma.config.ts ./apps/api/
# add user and group
RUN chown -R appuser:appgroup /app
USER appuser
WORKDIR /app/apps/api
CMD ["sh", "-c", "pnpm dlx prisma migrate deploy && node dist/src/main"]

