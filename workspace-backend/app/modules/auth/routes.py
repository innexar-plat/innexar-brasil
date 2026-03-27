import bcrypt as _bcrypt

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import unauthorized
from app.core.security import create_access_token
from app.database.session import get_db
from app.modules.auth.controllers.auth_controller import AuthController
from app.modules.auth.dtos.login_dto import LoginRequestDto, LoginResponseDto
from app.modules.auth.repositories.database_auth_repository import DatabaseAuthRepository

router = APIRouter(prefix="/auth", tags=["auth"])

# Kept for unit-test compat (test_auth_controller_login calls AuthController directly)
_controller = AuthController()


@router.post("/login", response_model=LoginResponseDto, status_code=status.HTTP_200_OK)
async def login(
    payload: LoginRequestDto,
    db: AsyncSession | None = Depends(get_db),
) -> LoginResponseDto:
    """Authenticate with email + password, return JWT access token."""
    repo = DatabaseAuthRepository(db)
    user = await repo.find_by_email(payload.email)

    if user is None:
        raise unauthorized("Invalid credentials")

    if not _bcrypt.checkpw(payload.password.encode(), user.password_hash.encode()):
        raise unauthorized("Invalid credentials")

    token = create_access_token(subject=user.id)
    return LoginResponseDto(access_token=token)
