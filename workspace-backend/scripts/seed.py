"""
Seed script — creates the users table and inserts initial users.

Run inside the backend container:
    docker exec innexar-br-backend python scripts/seed.py

Or locally (with DATABASE_URL pointing to the DB):
    python scripts/seed.py
"""

from __future__ import annotations

import asyncio
import os
import uuid

import bcrypt
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

# ── Config ─────────────────────────────────────────────────────────────────────
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+asyncpg://innexar:0348e85f7b2169f0d2e52e30bc83eb41@db:5432/innexar_workspace",
)

# ── Initial users ───────────────────────────────────────────────────────────────
INITIAL_USERS = [
    {
        "id": "00000000-0000-0000-0000-000000000001",
        "email": "admin@innexar.com",
        "password": "admin12345",
        "role": "admin",
    },
]


# ── Helpers ─────────────────────────────────────────────────────────────────────

def _hash(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


async def _create_table(session: AsyncSession) -> None:
    await session.execute(text("""
        CREATE TABLE IF NOT EXISTS users (
            id          VARCHAR(36)  PRIMARY KEY,
            email       VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            role        VARCHAR(50)  NOT NULL DEFAULT 'user',
            created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
            updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
        )
    """))
    await session.commit()
    print("✔  Table 'users' ready.")


async def _seed_users(session: AsyncSession) -> None:
    for u in INITIAL_USERS:
        exists = await session.execute(
            text("SELECT 1 FROM users WHERE email = :email"),
            {"email": u["email"]},
        )
        if exists.fetchone():
            print(f"   skip  {u['email']} (already exists)")
            continue

        await session.execute(
            text("""
                INSERT INTO users (id, email, password_hash, role)
                VALUES (:id, :email, :password_hash, :role)
            """),
            {
                "id": u["id"],
                "email": u["email"],
                "password_hash": _hash(u["password"]),
                "role": u["role"],
            },
        )
        print(f"   ✔  Created {u['role']}  {u['email']}")

    await session.commit()


async def main() -> None:
    engine = create_async_engine(DATABASE_URL, echo=False)
    Session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with Session() as session:
        await _create_table(session)
        await _seed_users(session)

    await engine.dispose()
    print("\nSeed concluído.")


if __name__ == "__main__":
    asyncio.run(main())
