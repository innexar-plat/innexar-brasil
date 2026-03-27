from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.auth.entities.user_entity import UserEntity
from app.modules.auth.entities.user_model import UserModel
from app.modules.auth.repositories.auth_repository import AuthRepository


class DatabaseAuthRepository:
    """
    Production repository that queries PostgreSQL via async SQLAlchemy.
    When db=None (test environment with overridden dependency) it falls back
    to the in-memory stub so all existing tests keep passing without a live DB.
    """

    def __init__(self, db: AsyncSession | None) -> None:
        self._db = db
        self._stub = AuthRepository()

    async def find_by_email(self, email: str) -> UserEntity | None:
        if self._db is None:
            return self._stub.find_by_email(email)

        result = await self._db.execute(
            select(UserModel).where(UserModel.email == email)
        )
        row = result.scalars().first()
        if row is None:
            return None

        return UserEntity(
            id=str(row.id),
            email=row.email,
            password_hash=row.password_hash,
            role=row.role,
        )
