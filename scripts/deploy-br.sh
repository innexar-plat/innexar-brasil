#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SERVICES=(
  "innexar-workspace"
  "innexar-workspace-app"
  "innexar-websitebr"
  "innexar-portal"
  "innexar-training"
)

echo "Deploy root: ${ROOT_DIR}"
echo "Image repository: ${IMAGE_REPOSITORY:-ghcr.io/innexar-plat/innexar-brasil}"
echo "Image tag: ${IMAGE_TAG:-latest}"

for service in "${SERVICES[@]}"; do
  echo "==> Deploying ${service}"
  pushd "${ROOT_DIR}/${service}" >/dev/null

  if docker compose pull; then
    docker compose up -d --remove-orphans
  elif [[ "${ALLOW_BUILD_FALLBACK:-false}" == "true" ]]; then
    echo "Pull failed for ${service}; using build fallback"
    docker compose up -d --build --remove-orphans
  else
    echo "Pull failed for ${service} and build fallback is disabled"
    exit 1
  fi

  popd >/dev/null
done

docker image prune -af --filter "until=168h" || true