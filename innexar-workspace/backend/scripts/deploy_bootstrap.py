#!/usr/bin/env python3
"""Run idempotent bootstrap tasks during deploy.

This script is intended to run automatically on container startup in production.
It creates/updates the default admin and executes canonical seed scripts.
"""

from __future__ import annotations

import asyncio
import os
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from scripts.create_admin import create_or_update_admin


def _is_enabled(env_name: str, default: str = "1") -> bool:
    value = os.environ.get(env_name, default).strip().lower()
    return value not in {"0", "false", "no", "off"}


def _run_script(script_name: str) -> None:
    script_path = Path(__file__).resolve().parent / script_name
    print(f"[deploy-bootstrap] running {script_name}")
    subprocess.run([sys.executable, str(script_path)], check=True)


async def main() -> None:
    if not _is_enabled("DEPLOY_BOOTSTRAP_ENABLED", "1"):
        print("[deploy-bootstrap] disabled via DEPLOY_BOOTSTRAP_ENABLED")
        return

    admin_email = os.environ.get("DEPLOY_ADMIN_EMAIL", "admin@innexar.com.br")
    admin_password = os.environ.get("DEPLOY_ADMIN_PASSWORD", "Innexar@2026")

    if _is_enabled("DEPLOY_BOOTSTRAP_ADMIN", "1"):
        print(f"[deploy-bootstrap] ensuring admin user: {admin_email}")
        await create_or_update_admin(admin_email, admin_password)

    if _is_enabled("DEPLOY_BOOTSTRAP_SEEDS", "1"):
        # Canonical product seeds (idempotent).
        _run_script("seed_products_catalog.py")
        _run_script("seed_products_site_venda.py")
        _run_script("seed_product_static_hosting.py")

    # Optional integration seed only when required env is present.
    has_hestia_env = all(
        os.environ.get(name)
        for name in (
            "HESTIA_BASE_URL",
            "HESTIA_ACCESS_KEY",
            "HESTIA_SECRET_KEY",
        )
    )
    if _is_enabled("DEPLOY_BOOTSTRAP_HESTIA", "1") and has_hestia_env:
        _run_script("seed_hestia_integration.py")
    elif _is_enabled("DEPLOY_BOOTSTRAP_HESTIA", "1"):
        print("[deploy-bootstrap] skipping seed_hestia_integration.py (missing HESTIA_* env vars)")

    print("[deploy-bootstrap] completed")


if __name__ == "__main__":
    asyncio.run(main())
