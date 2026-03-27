import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock

from app.modules.auth.controllers.auth_controller import AuthController
from app.modules.auth.dtos.login_dto import LoginRequestDto, LoginResponseDto
from app.modules.auth.entities.user_entity import UserEntity
from app.modules.auth.repositories.auth_repository import AuthRepository
from app.modules.auth.repositories.database_auth_repository import DatabaseAuthRepository
from app.modules.auth.services.auth_service import AuthService


def test_auth_repository_find_admin() -> None:
    repo = AuthRepository()
    user = repo.find_by_email("admin@innexar.com")

    assert isinstance(user, UserEntity)
    assert user is not None
    assert user.role == "admin"


def test_auth_repository_find_unknown() -> None:
    repo = AuthRepository()
    user = repo.find_by_email("unknown@innexar.com")
    assert user is None


def test_auth_service_success() -> None:
    service = AuthService(AuthRepository())
    dto = LoginRequestDto(email="admin@innexar.com", password="admin12345")

    result = service.login(dto)
    assert isinstance(result, LoginResponseDto)
    assert result.token_type == "bearer"
    assert result.access_token


def test_auth_service_invalid_password() -> None:
    service = AuthService(AuthRepository())
    dto = LoginRequestDto(email="admin@innexar.com", password="wrongpass123")

    with pytest.raises(HTTPException) as err:
        service.login(dto)

    assert err.value.status_code == 401


def test_auth_service_invalid_user() -> None:
    service = AuthService(AuthRepository())
    dto = LoginRequestDto(email="nouser@innexar.com", password="wrongpass123")

    with pytest.raises(HTTPException) as err:
        service.login(dto)

    assert err.value.status_code == 401


def test_auth_controller_login() -> None:
    controller = AuthController()
    dto = LoginRequestDto(email="admin@innexar.com", password="admin12345")

    result = controller.login(dto)
    assert result.access_token


def test_auth_route_login_success(client: TestClient) -> None:
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@innexar.com", "password": "admin12345"},
    )

    assert response.status_code == 200
    data = response.json()
    assert data["token_type"] == "bearer"
    assert isinstance(data["access_token"], str)


def test_auth_route_login_validation_error(client: TestClient) -> None:
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "admin@innexar.com", "password": "short"},
    )

    assert response.status_code == 422

def test_auth_dependency_invalid_jwt(client: TestClient) -> None:
    response = client.get("/api/v1/customers", headers={"Authorization": "Bearer totally.invalid.token"})
    assert response.status_code == 401


def test_auth_dependency_missing_sub(client: TestClient) -> None:
    from jose import jwt as jose_jwt
    from app.config import settings
    # Create token with no 'sub' claim
    token = jose_jwt.encode({"data": "nosub"}, settings.jwt_secret, algorithm=settings.jwt_algorithm)
    response = client.get("/api/v1/customers", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401


# ── DatabaseAuthRepository ────────────────────────────────────────────────────

def test_db_repository_falls_back_to_stub_when_db_is_none() -> None:
    """When db=None (test env), delegates to AuthRepository stub."""
    import asyncio
    repo = DatabaseAuthRepository(None)
    user = asyncio.run(repo.find_by_email("admin@innexar.com"))
    assert user is not None
    assert user.email == "admin@innexar.com"
    assert user.role == "admin"


def test_db_repository_unknown_email_returns_none_when_db_is_none() -> None:
    import asyncio
    repo = DatabaseAuthRepository(None)
    user = asyncio.run(repo.find_by_email("nobody@innexar.com"))
    assert user is None


def test_db_repository_queries_real_db_when_session_provided() -> None:
    """When a real DB session is provided, it executes a query and maps the result."""
    import asyncio
    from app.modules.auth.entities.user_model import UserModel

    # Build a minimal UserModel row mock
    mock_row = UserModel()
    mock_row.id = "00000000-0000-0000-0000-000000000002"
    mock_row.email = "dbuser@innexar.com"
    mock_row.password_hash = "$2b$12$fakehashforthisunittest000000000000000000000000000000000"
    mock_row.role = "user"

    mock_scalars = MagicMock()
    mock_scalars.first.return_value = mock_row
    mock_result = MagicMock()
    mock_result.scalars.return_value = mock_scalars

    mock_db = AsyncMock()
    mock_db.execute = AsyncMock(return_value=mock_result)

    repo = DatabaseAuthRepository(mock_db)
    user = asyncio.run(repo.find_by_email("dbuser@innexar.com"))

    assert user is not None
    assert user.email == "dbuser@innexar.com"
    assert user.role == "user"
    mock_db.execute.assert_called_once()


def test_db_repository_returns_none_when_row_not_found() -> None:
    """Returns None when the DB query finds no matching row."""
    import asyncio

    mock_scalars = MagicMock()
    mock_scalars.first.return_value = None
    mock_result = MagicMock()
    mock_result.scalars.return_value = mock_scalars

    mock_db = AsyncMock()
    mock_db.execute = AsyncMock(return_value=mock_result)

    repo = DatabaseAuthRepository(mock_db)
    user = asyncio.run(repo.find_by_email("ghost@innexar.com"))

    assert user is None
