from app.modules.auth.entities.user_entity import UserEntity


class AuthRepository:
    """Repository layer isolated from controller and service concerns."""

    def find_by_email(self, email: str) -> UserEntity | None:
        # Stub repository for initial workspace bootstrap.
        if email == "admin@innexar.com":
            return UserEntity(
                id="00000000-0000-0000-0000-000000000001",
                email=email,
                password_hash="admin12345",
                role="admin",
            )
        return None
