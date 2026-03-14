# Build do site Brasil (innexar-websitebr) a partir da raiz do monorepo.
# Use este Dockerfile no Coolify se preferir "Dockerfile" em vez de Nixpacks.
# Multi-stage, espelhando innexar-websitebr/Dockerfile.

FROM node:22-alpine AS builder

WORKDIR /app

COPY innexar-websitebr/package.json innexar-websitebr/package-lock.json ./
RUN npm ci --no-audit --fund=false

COPY innexar-websitebr/ .

ARG NEXT_PUBLIC_USE_WORKSPACE_API
ARG NEXT_PUBLIC_WORKSPACE_API_URL
ARG NEXT_PUBLIC_MP_PUBLIC_KEY
ARG NEXT_PUBLIC_PORTAL_URL
ARG NEXT_PUBLIC_WORKSPACE_URL
ENV NEXT_PUBLIC_USE_WORKSPACE_API=$NEXT_PUBLIC_USE_WORKSPACE_API
ENV NEXT_PUBLIC_WORKSPACE_API_URL=$NEXT_PUBLIC_WORKSPACE_API_URL
ENV NEXT_PUBLIC_MP_PUBLIC_KEY=$NEXT_PUBLIC_MP_PUBLIC_KEY
ENV NEXT_PUBLIC_PORTAL_URL=$NEXT_PUBLIC_PORTAL_URL
ENV NEXT_PUBLIC_WORKSPACE_URL=$NEXT_PUBLIC_WORKSPACE_URL

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

CMD ["node", "server.js"]
