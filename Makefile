# innexar-websitebr — atalhos (containers de produção com volumes / hot-reload)
.PHONY: help build up down rebuild logs dev lint test

SERVICE := innexar-websitebr

help:
	@echo "  make build   - Build da imagem Docker (--no-cache)"
	@echo "  make up      - Sobe os containers (com volumes, hot-reload)"
	@echo "  make down    - Para e remove os containers"
	@echo "  make rebuild - Build + up"
	@echo "  make logs    - Logs do serviço (follow, tail 50)"
	@echo "  make dev     - Next.js em desenvolvimento local (npm run dev)"
	@echo "  make lint    - ESLint"
	@echo "  make test    - Testes"

build:
	docker compose build --no-cache $(SERVICE)

up:
	docker compose up -d --force-recreate

down:
	docker compose down

rebuild: build up
	@echo "Rebuild e up concluídos. Verifique: make logs"

logs:
	docker compose logs -f --tail=50 $(SERVICE)

dev:
	npm run dev

lint:
	npm run lint

test:
	npm test
