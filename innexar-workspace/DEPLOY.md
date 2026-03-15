# Deploy — Innexar Workspace (Backend FastAPI)

## Projeto
- **Nome:** innexar-workspace-backend
- **Repositório:** https://github.com/innexar-plat/innexar-workspace
- **Branch:** main
- **Server Coolify:** projetos-br (VM 102 · 10.10.10.102)
- **UUID da app:** _(preencher após criar no Coolify)_

## Domínios
- API: `https://api.innexar.com.br`
- Frontend consumidor: `https://app.innexar.com.br`, `https://portal.innexar.com.br`, `https://innexar.com.br`

## Runtime
- Build pack: `dockerfile`
- Dockerfile: `backend/Dockerfile`
- Porta interna: `8000`
- Start command:

```bash
sh -c "python scripts/deploy_bootstrap.py && uvicorn app.main:app --host 0.0.0.0 --port 8000"
```

## Banco

> **Situação atual:** PostgreSQL rodando como sidecar Docker (`innexar-workspace-postgres`).
> **Migração planejada:** mover para VM 106 (`10.10.10.106`) quando db-prod estiver pronto.

| Campo        | Valor atual (sidecar)                  | Valor futuro (db-prod)                |
|--------------|----------------------------------------|---------------------------------------|
| Host         | `postgres` (service name)              | `10.10.10.106`                        |
| Porta        | `5432`                                 | `5432` (ou `6432` via PgBouncer)      |
| Database     | `innexar_workspace`                    | `innexar_workspace`                   |
| User         | `workspace_user` ⚠️ (deveria ser `innexar_workspace` per naming standard) | `innexar_workspace` |
| DATABASE_URL | `postgresql+asyncpg://workspace_user:<pwd>@postgres:5432/innexar_workspace` | `postgresql+asyncpg://innexar_workspace:<pwd>@10.10.10.106:5432/innexar_workspace` |

### Backup
- Sidecar: volume Docker `innexar_workspace_postgres_data` (sem backup automatizado)
- db-prod: backup diário às 03:30 via Proxmox job `daily-prod` (retenção 7d/4w/3m)

### Restore
- Sidecar: `docker exec innexar-workspace-postgres pg_dump ...` → restaurar com `psql`
- db-prod: restore via snapshot Proxmox ou `pg_restore`

## Variáveis obrigatórias

```env
DATABASE_URL=postgresql+asyncpg://workspace_user:<senha>@postgres:5432/innexar_workspace
ENVIRONMENT=production
SECRET_KEY_STAFF=<string aleatória longa>
SECRET_KEY_CUSTOMER=<string aleatória longa>
CORS_ORIGINS=https://innexar.com.br,https://www.innexar.com.br,https://portal.innexar.com.br,https://app.innexar.com.br
FRONTEND_URL=https://innexar.com.br
PORTAL_URL=https://portal.innexar.com.br
SEED_TOKEN=<token para seeds autenticados>
MP_ACCESS_TOKEN=<MercadoPago access token>
MP_PUBLIC_KEY=<MercadoPago public key>
MP_WEBHOOK_SECRET=<segredo do webhook MP>
SMTP_HOST=mail.innexar.com.br
SMTP_PORT=587
SMTP_USER=contato@innexar.com.br
SMTP_PASSWORD=<senha>
MINIO_ENDPOINT=http://minio:9000
MINIO_ACCESS_KEY=<access key>
MINIO_SECRET_KEY=<secret key>
DEPLOY_ADMIN_EMAIL=admin@innexar.com.br
DEPLOY_ADMIN_PASSWORD=<senha admin>
```

## Operação

### Migrations
> ⚠️ **Pendência:** `alembic upgrade head` não roda no bootstrap. Tabelas criadas via `Base.metadata.create_all` no lifespan.
> Para usar alembic em produção run:
> ```bash
> docker exec innexar-workspace-backend alembic upgrade head
> ```
> Quando migrar para db-prod, stampear o head antes da primeira migração:
> ```bash
> alembic stamp head
> ```

### Bootstrap (automático na subida)
```bash
python scripts/deploy_bootstrap.py
```
Controlado por env vars:
- `DEPLOY_BOOTSTRAP_ENABLED=1`
- `DEPLOY_BOOTSTRAP_ADMIN=1` → cria/atualiza admin
- `DEPLOY_BOOTSTRAP_SEEDS=1` → roda seeds de catálogo
- `DEPLOY_BOOTSTRAP_HESTIA=1` → seed Hestia (só se HESTIA_* estiver configurado)

### Create admin manual
```bash
docker exec innexar-workspace-backend python scripts/create_admin.py
```

### Seed catálogo manual
```bash
docker exec innexar-workspace-backend python scripts/seed_products_catalog.py
```

## Smoke Test

```bash
# Health
curl https://api.innexar.com.br/health

# Login staff
curl -X POST https://api.innexar.com.br/auth/staff/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@innexar.com.br","password":"<senha>"}'

# Me (com token do login)
curl https://api.innexar.com.br/auth/staff/me \
  -H "Authorization: Bearer <token>"

# CORS preflight
curl -X OPTIONS https://api.innexar.com.br/auth/staff/login \
  -H "Origin: https://portal.innexar.com.br" -I
```

## Rollback

```bash
# Reverter para imagem anterior
docker compose pull workspace-backend  # ou editar IMAGE_TAG no .env
docker compose up -d --no-build backend
```

Se usando GHCR:
```bash
IMAGE_TAG=sha-<commit-anterior> docker compose up -d backend
```

## Riscos comuns

- Porta do Traefik divergente da porta real (configurado corretamente para 8000)
- Admin criado sem RBAC validado
- `DATABASE_URL` com usuário errado após migração para db-prod
- Sidecar postgres sem backup → dados perdidos em recriação de volume
- `alembic upgrade head` não roda → schema desatualizado após migrations novas
