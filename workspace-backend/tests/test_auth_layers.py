import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.modules.auth.controllers.auth_controller import AuthController
from app.modules.auth.dtos.login_dto import LoginRequestDto, LoginResponseDto
from app.modules.auth.entities.user_entity import UserEntity
from app.modules.auth.repositories.auth_repository import AuthRepository
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
