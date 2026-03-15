"""Create or update a staff admin user.

Usage (inside the container or with .venv):
    python scripts/create_admin.py --email admin@example.com --password SenhaForte1!
    python scripts/create_admin.py  # uses defaults below
"""

import argparse
import asyncio
import sys

from sqlalchemy import select
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

sys.path.insert(0, ".")
# Import all models so SQLAlchemy mapper registry is fully initialised
import app.models  # noqa: F401
import app.modules.billing.models  # noqa: F401
import app.modules.crm.models  # noqa: F401
import app.modules.files.models  # noqa: F401
import app.modules.projects.models  # noqa: F401
import app.modules.support.models  # noqa: F401
from app.core.config import settings
from app.core.security import hash_password
from app.models.user import User


async def create_or_update_admin(email: str, password: str) -> None:
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    Session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with Session() as db:
        result = await db.execute(select(User).where(User.email == email).limit(1))
        user = result.scalar_one_or_none()

        if user:
            user.password_hash = hash_password(password)
            user.role = "admin"
            action = "atualizado"
        else:
            user = User(
                email=email,
                password_hash=hash_password(password),
                role="admin",
                org_id="innexar",
            )
            db.add(user)
            action = "criado"

        await db.commit()
        print(f"✓ Admin {action}: {email}")

    await engine.dispose()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Cria ou atualiza um admin no workspace.")
    parser.add_argument("--email", default="admin@innexar.com.br")
    parser.add_argument("--password", default="Innexar@2026")
    args = parser.parse_args()

    asyncio.run(create_or_update_admin(args.email, args.password))
