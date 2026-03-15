# Innexar Workspace Backend

API e infraestrutura local do workspace da Innexar.

## Desenvolvimento

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Docker

```bash
docker compose up -d --build
```

## CI

Este app inclui workflows proprios em `.github/workflows` para uso no repositorio individual:

- `ci.yml`: ruff, black, mypy e pytest
- `docker.yml`: build e publish da imagem no GHCR