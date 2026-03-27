.PHONY: install test quality build ci

PYTHON := .venv/bin/python
PIP := .venv/bin/pip

$(PYTHON):
	python3 -m venv .venv

install: $(PYTHON)
	$(PYTHON) -m ensurepip --upgrade
	$(PIP) install -r requirements.txt

test: $(PYTHON)
	$(PYTHON) -m pytest

quality: $(PYTHON)
	.venv/bin/ruff check app tests
	$(PYTHON) -m compileall app tests
	$(PYTHON) -m pytest

build: $(PYTHON)
	$(PYTHON) -m compileall app

ci: quality build
