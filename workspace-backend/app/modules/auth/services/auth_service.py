import bcrypt as _bcrypt

from app.core.errors import unauthorized
from app.core.security import create_access_token
from app.modules.auth.dtos.login_dto import LoginRequestDto, LoginResponseDto
from app.modules.auth.repositories.auth_repository import AuthRepository


class AuthService:
    """Synchronous auth service — used by unit tests via AuthRepository stub."""

    def __init__(self, repository: AuthRepository) -> None:
        self.repository = repository

    def login(self, dto: LoginRequestDto) -> LoginResponseDto:
        user = self.repository.find_by_email(dto.email)
        if user is None:
            raise unauthorized("Invalid credentials")

        if not _bcrypt.checkpw(dto.password.encode(), user.password_hash.encode()):
            raise unauthorized("Invalid credentials")

        token = create_access_token(subject=user.id)
        return LoginResponseDto(access_token=token)
