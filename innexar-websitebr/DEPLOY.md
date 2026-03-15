# Deploy — Innexar Website BR (Next.js)

## Projeto
- **Nome:** innexar-websitebr
- **Repositório:** https://github.com/innexar-plat/innexar-websitebr
- **Branch:** main
- **Server Coolify:** projetos-br (VM 102 · 10.10.10.102)
- **UUID da app:** _(preencher após criar no Coolify)_

## Domínio
- App: `https://innexar.com.br` e `https://www.innexar.com.br`
- Redirect www → não-www: habilitado via Traefik middlewares no compose
- API consumida: `https://api.innexar.com.br`

## Runtime
- Build pack: `dockerfile`
- Dockerfile: `Dockerfile`
- Porta interna: `3000`
- Tipo de build: **standalone** (`output: "standalone"` em `next.config.ts`)
- Start command:

```bash
node server.js
```

## Build Args (embutidos no build — obrigatórios)

```env
NEXT_PUBLIC_USE_WORKSPACE_API=true
NEXT_PUBLIC_WORKSPACE_API_URL=https://api.innexar.com.br
NEXT_PUBLIC_MP_PUBLIC_KEY=<chave pública MercadoPago>
NEXT_PUBLIC_PORTAL_URL=https://portal.innexar.com.br
NEXT_PUBLIC_WORKSPACE_URL=https://app.innexar.com.br
```

## Variáveis de runtime

```env
NODE_ENV=production
PORT=3000
NEXT_TELEMETRY_DISABLED=1
RESEND_API_KEY=<chave Resend para emails de contato>
RESEND_FROM_EMAIL=contato@innexar.com.br
CONTACT_RECIPIENT_EMAIL=contato@innexar.com.br
ENABLE_AUTO_REPLY=true
SMTP_HOST=mail.innexar.com.br
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=contato@innexar.com.br
SMTP_PASSWORD=<senha>
SMTP_FROM_EMAIL=contato@innexar.com.br
```

## Operação

Não requer migrations ou seed. Site institucional + formulário de contato (Resend ou SMTP).

## Smoke Test

```bash
# Homepage
curl -L https://innexar.com.br -o /dev/null -w "%{http_code}"

# Redirect www
curl -I https://www.innexar.com.br
# Espera Location: https://innexar.com.br/

# Assets estáticos
curl -s -o /dev/null -w "%{http_code}" https://innexar.com.br/_next/static/chunks/main.js
```

## Rollback

```bash
IMAGE_TAG=sha-<commit-anterior> docker compose up -d innexar-websitebr
```

## Riscos comuns

- `next start` em build standalone (CMD correto é `node server.js`)
- `RESEND_API_KEY` vazio → formulário de contato não envia emails
- Redirect www→não-www mal configurado → loop de redirect
- `NEXT_PUBLIC_MP_PUBLIC_KEY` vazio → checkout desabilitado no site
