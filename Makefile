NODE_APPS := innexar-websitebr innexar-portal innexar-training innexar-workspace-app
COMPOSE_DIRS := innexar-websitebr innexar-portal innexar-training innexar-workspace-app innexar-workspace
ROOT_DIR := $(dir $(abspath $(lastword $(MAKEFILE_LIST))))

.PHONY: quality-node quality-python quality-all build-node compose-check docker-build-smoke

quality-node:
	@set -e; \
	for app in $(NODE_APPS); do \
		echo "==> $$app: npm ci"; \
		cd "$(ROOT_DIR)$$app" && npm ci; \
		echo "==> $$app: lint"; \
		npm run lint; \
		if [ "$$app" = "innexar-websitebr" ]; then \
			echo "==> $$app: test"; \
			npm test -- --runInBand; \
		fi; \
		echo "==> $$app: build"; \
		npm run build; \
		done

quality-python:
	@set -e; \
		cd "$(ROOT_DIR)innexar-workspace/backend"; \
		python3 -m pip install -r requirements.txt '.[dev]' pytest-asyncio pytest-cov aiosqlite; \
		ruff check app tests; \
		black --check app tests; \
		mypy app; \
		PYTHONPATH=. pytest tests/ -v --tb=short

quality-all: quality-node quality-python compose-check

build-node:
	@set -e; \
	for app in $(NODE_APPS); do \
		echo "==> $$app: build"; \
		cd "$(ROOT_DIR)$$app" && npm ci && npm run build; \
		done

compose-check:
	@set -e; \
	for app in $(COMPOSE_DIRS); do \
		echo "==> $$app: docker compose config"; \
		cd "$(ROOT_DIR)$$app" && docker compose config -q; \
		done

docker-build-smoke:
	@set -e; \
	for app in innexar-websitebr innexar-portal innexar-training innexar-workspace-app; do \
		echo "==> $$app: docker build"; \
		docker build -t $$app:ci "$(ROOT_DIR)$$app"; \
		done; \
		echo "==> innexar-workspace/backend: docker build"; \
		docker build -t innexar-workspace-backend:ci "$(ROOT_DIR)innexar-workspace/backend"