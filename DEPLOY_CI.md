# Innexar Brasil CI/CD

Este stack foi preparado para um fluxo de qualidade + publish de imagens + deploy em producao sem rebuild no servidor.

## Workflows

- `quality.yml`: lint, testes, build e validacao de compose.
- `docker-images.yml`: build e publish de imagens em `ghcr.io`.
- `codeql.yml`: analise estatica de seguranca para JavaScript/TypeScript e Python.
- `trivy.yml`: varredura de vulnerabilidades e misconfiguracoes.
- `deploy-production.yml`: deploy manual para o VPS de producao BR.

## Imagens publicadas

As imagens sao publicadas em:

- `ghcr.io/innexar-plat/innexar-brasil/websitebr`
- `ghcr.io/innexar-plat/innexar-brasil/portal`
- `ghcr.io/innexar-plat/innexar-brasil/training`
- `ghcr.io/innexar-plat/innexar-brasil/workspace-app`
- `ghcr.io/innexar-plat/innexar-brasil/workspace-backend`

Cada imagem recebe pelo menos estas tags:

- `latest`
- `sha-<commit>`

## Secrets obrigatorios

Configure no repositorio GitHub:

- `PROD_HOST`
- `PROD_USER`
- `PROD_PORT`
- `PROD_SSH_KEY`
- `GHCR_USERNAME`
- `GHCR_TOKEN`

## Variables recomendadas

- `PROD_DEPLOY_PATH` exemplo: `/srv/innexar-brasil`
- `NEXT_PUBLIC_MP_PUBLIC_KEY` se quiser embutir a chave publica de producao nos builds web

## Estrutura esperada no VPS

O repositorio deve existir no servidor em `${PROD_DEPLOY_PATH}` com esta estrutura:

- `innexar-websitebr`
- `innexar-portal`
- `innexar-training`
- `innexar-workspace-app`
- `innexar-workspace`
- `scripts/deploy-br.sh`

## Fluxo recomendado

1. Merge em `main` ou `master`.
2. `quality.yml` valida codigo, testes e build.
3. `docker-images.yml` publica as imagens no GHCR.
4. `deploy-production.yml` e executado manualmente com a tag desejada.
5. O VPS faz `docker compose pull` e `docker compose up -d` sem rebuild.

## Observacoes operacionais

- O banco Postgres e o MinIO permanecem em volumes do servidor; o deploy nao remove volumes.
- O script de deploy aceita `ALLOW_BUILD_FALLBACK=true` apenas como contingencia.
- Para rollback, execute o deploy com uma tag anterior `sha-<commit>`.