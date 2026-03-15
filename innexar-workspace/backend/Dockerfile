# Innexar Workspace API - multi-stage
FROM python:3.11-slim AS builder

WORKDIR /app

# Build deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Runtime
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# Copy deps from builder
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# App
COPY . .
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Default: run deploy bootstrap tasks and then API.
CMD ["sh", "-c", "python scripts/deploy_bootstrap.py && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
