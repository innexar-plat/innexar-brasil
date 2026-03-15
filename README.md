# Innexar Brasil Monorepo

Este repositorio agrupa os apps Brasil e os artefatos de CI e deploy.

## Regra de deploy

Cada app deve ser implantado a partir do seu proprio diretorio base.

- `innexar-websitebr`
- `innexar-portal`
- `innexar-training`
- `innexar-workspace-app`
- `innexar-workspace`

Nao use a raiz do monorepo como aplicacao no Coolify.

## O que fica na raiz

- `docker-compose.yml`: orquestracao do ambiente BR no VPS
- `.github/workflows`: CI, publicacao de imagens e deploy
- `scripts/deploy-br.sh`: pull das imagens e rollout dos apps
- `DEPLOY_CI.md`: instrucoes operacionais de build e deploy

## Imagens publicadas

As imagens seguem o namespace:

- `ghcr.io/innexar-plat/innexar-brasil/websitebr`
- `ghcr.io/innexar-plat/innexar-brasil/portal`
- `ghcr.io/innexar-plat/innexar-brasil/training`
- `ghcr.io/innexar-plat/innexar-brasil/workspace-app`
- `ghcr.io/innexar-plat/innexar-brasil/workspace-backend`