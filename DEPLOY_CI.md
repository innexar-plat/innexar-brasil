# Innexar Brasil CI/CD

Este stack suporta dois fluxos: **monorepo** (CI na raiz) e **repositórios individuais** (cada app com seu repo e CI próprio). O deploy em produção usa Docker Compose com imagens do GHCR.

## Repositórios individuais (recomendado)

Cada app pode ser desenvolvido e implantado a partir do seu próprio repositório.

### Criar os repositórios no GitHub

Crie repositórios **vazios** (sem README, sem .gitignore) na organização `innexar-plat`:

- `innexar-plat/innexar-websitebr`
- `innexar-plat/innexar-portal`
- `innexar-plat/innexar-training`
- `innexar-plat/innexar-workspace-app`
- `innexar-plat/innexar-workspace`

### Push do monorepo para os repos individuais

A partir da raiz do monorepo (`Innexar-Brasil`):

```bash
./scripts/push-to-individual-repos.sh
```

O script usa `git subtree push`: cada pasta (ex.: `innexar-websitebr`) é enviada para o repo correspondente na branch `main`. Execute após commits no monorepo para espelhar o código nos repos individuais.

### CI em cada repo

Cada repositório individual contém em sua raiz (após o subtree push):

- `.github/workflows/ci.yml`: lint, testes (quando houver), build.
- `.github/workflows/docker.yml`: build e push da imagem para `ghcr.io/innexar-plat/<nome-do-repo>`.

As imagens passam a ser publicadas em:

- `ghcr.io/innexar-plat/innexar-websitebr`
- `ghcr.io/innexar-plat/innexar-portal`
- `ghcr.io/innexar-plat/innexar-training`
- `ghcr.io/innexar-plat/innexar-workspace-app`
- `ghcr.io/innexar-plat/innexar-workspace` (backend da API)

### Docker Compose na raiz do monorepo

O arquivo `docker-compose.yml` na raiz usa **apenas imagens** (sem build), puxadas do GHCR:

```bash
docker compose pull
docker compose up -d
```

Requer que a rede `fixelo_fixelo-network` exista (ex.: `docker network create fixelo_fixelo-network`). Cada serviço usa a imagem do seu repo (ex.: `ghcr.io/innexar-plat/innexar-websitebr:latest`).

---

## Monorepo (workflows na raiz)

- `quality.yml`: lint, testes, build e validação de compose para todos os apps.
- `docker-images.yml`: build e publish de imagens em `ghcr.io/innexar-plat/innexar-brasil/<nome>` (formato antigo).
- `codeql.yml`, `trivy.yml`, `deploy-production.yml`: segurança e deploy.

Cada imagem recebe as tags `latest` e `sha-<commit>`.

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