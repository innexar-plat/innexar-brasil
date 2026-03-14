#!/usr/bin/env bash
# Envia cada app do monorepo para seu repositório individual via git subtree push.
# Pré-requisito: criar os repositórios vazios no GitHub (innexar-plat/<nome>) e ter permissão de push.
#
# Uso: ./scripts/push-to-individual-repos.sh [remote_base_url]
# Exemplo: ./scripts/push-to-individual-repos.sh https://github.com/innexar-plat

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BASE_URL="${1:-https://github.com/innexar-plat}"
BRANCH="${BRANCH:-main}"

# prefix (pasta no monorepo) -> nome do repo (e do remote)
declare -A APPS=(
  [innexar-websitebr]=innexar-websitebr
  [innexar-portal]=innexar-portal
  [innexar-training]=innexar-training
  [innexar-workspace-app]=innexar-workspace-app
  [innexar-workspace]=innexar-workspace
)

echo "Branch: $BRANCH"
echo "Base URL: $BASE_URL"
echo ""

for prefix in innexar-websitebr innexar-portal innexar-training innexar-workspace-app innexar-workspace; do
  repo="${APPS[$prefix]}"
  remote_name="remote-$repo"
  repo_url="${BASE_URL}/${repo}.git"

  if ! git remote get-url "$remote_name" 2>/dev/null; then
    echo "==> Adicionando remote: $remote_name -> $repo_url"
    git remote add "$remote_name" "$repo_url"
  else
    echo "==> Remote $remote_name já existe"
  fi

  echo "==> Push subtree $prefix -> $repo (branch $BRANCH)"
  git subtree push --prefix="$prefix" "$remote_name" "$BRANCH"
  echo ""
done

echo "Concluído. Cada repo em $BASE_URL/<nome> recebeu o conteúdo da pasta correspondente."
