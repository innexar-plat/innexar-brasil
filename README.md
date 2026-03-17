# Innexar Brasil – Workspace

Cada projeto é um **repositório Git separado**, com seu próprio `.git` e repositório no GitHub. Não é monorepo com subtree: você entra na pasta do projeto e dá `git push` no repo daquele projeto.

## Projetos (cada um com GitHub próprio)

| Pasta | Repositório GitHub |
|-------|--------------------|
| `innexar-websitebr/` | [innexar-plat/innexar-websitebr](https://github.com/innexar-plat/innexar-websitebr) |
| `innexar-workspace/` | [innexar-plat/innexar-workspace](https://github.com/innexar-plat/innexar-workspace) |
| `innexar-workspace-app/` | [innexar-plat/innexar-workspace-app](https://github.com/innexar-plat/innexar-workspace-app) |
| `innexar-portal/` | (configurar quando houver conteúdo) |
| `innexar-training/` | (configurar quando houver conteúdo) |

## Push por projeto

```bash
# Site
make push-websitebr
# ou: cd innexar-websitebr && git push origin main

# Backend workspace
make push-workspace

# App workspace
make push-workspace-app
```

Cada pasta tem seu próprio `git status` / `git add` / `git commit` / `git push`; o repositório da raiz (Innexar-Brasil) não rastreia o conteúdo das pastas dos projetos (elas estão no `.gitignore`).

## Desenvolvimento

- **Website:** `cd innexar-websitebr && npm install && npm run dev`
- **Workspace (backend):** ver `innexar-workspace/` (README no repo do projeto)
- **Workspace app:** `cd innexar-workspace-app && npm run dev`
