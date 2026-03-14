# Innexar Workspace Backend - quality and tests
# Usage: make venv then make install then make test

PYTHON ?= python3
VENV = .venv
BIN = $(VENV)/bin
PY = $(BIN)/python
PIP = $(BIN)/pip
PYTEST = $(BIN)/pytest

venv:
	$(PYTHON) -m venv $(VENV)

install: venv
	$(PIP) install -r requirements.txt
	$(PIP) install pytest pytest-asyncio aiosqlite

lint:
	$(BIN)/ruff check app tests

format:
	$(BIN)/black app tests

format-check:
	$(BIN)/black --check app tests

typecheck:
	$(BIN)/mypy app

test:
	PYTHONPATH=. $(PYTEST) tests/ -v --tb=short

test-unit:
	PYTHONPATH=. $(PYTEST) tests/unit/ -v --tb=short

test-integration:
	PYTHONPATH=. $(PYTEST) tests/integration/ -v --tb=short

test-e2e:
	PYTHONPATH=. $(PYTEST) tests/e2e/ -v --tb=short

# Coverage: pytest-cov (install with pip install -e ".[dev]")
coverage:
	PYTHONPATH=. $(PYTEST) tests/ --cov=app --cov-report=term-missing --cov-report=html -v --tb=short

# Run tests inside Docker (from repo root: make -C .. docker-test or cd .. && docker compose run --rm backend pytest tests/ -v)
docker-test:
	cd .. && docker compose run --rm backend pytest tests/ -v --tb=short

all: format-check lint typecheck test

.PHONY: venv install lint format format-check typecheck test test-unit test-integration test-e2e coverage docker-test all
