# Dockerfile para Innexar Website
# Build multi-stage para otimizar tamanho da imagem

# Stage 1: Build
FROM node:25-alpine AS builder

WORKDIR /app

# Copia arquivos de dependências
COPY package.json package-lock.json ./

# Instala dependências
RUN npm ci --no-audit --fund=false

# Copia o código fonte
COPY . .

# Variáveis NEXT_PUBLIC_* são embutidas no build
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

# Build da aplicação
RUN npm run build

# Stage 2: Production
FROM node:25-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Cria usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia arquivos necessários do builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
