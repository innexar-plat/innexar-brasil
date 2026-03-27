from app.modules.auth.entities.user_entity import UserEntity

# bcrypt hash of "admin12345" — used by the in-memory stub (tests + fallback)
_ADMIN_HASH = "$2b$12$T2bly/PsKcSvk.zhhB7U/O553hfP7cm10BJn4A9N/RaHZWRJTq3my"


class AuthRepository:
    """In-memory stub repository — used by unit tests and as a fallback."""

    def find_by_email(self, email: str) -> UserEntity | None:
        if email == "admin@innexar.com":
            return UserEntity(
                id="00000000-0000-0000-0000-000000000001",
                email=email,
                password_hash=_ADMIN_HASH,
                role="admin",
            )
        return None
