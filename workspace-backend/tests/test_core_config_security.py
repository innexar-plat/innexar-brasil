from app.config import Settings, settings
from app.core.errors import forbidden, not_found, unauthorized
from app.core.security import create_access_token


def test_settings_defaults() -> None:
    local = Settings()
    assert local.app_name == "innexar-workspace-backend"
    assert local.app_env == "development"
    assert local.app_port == 8000


def test_settings_singleton_loaded() -> None:
    assert settings.jwt_algorithm == "HS256"


def test_error_helpers() -> None:
    err_401 = unauthorized("bad auth")
    err_403 = forbidden("bad role")
    err_404 = not_found("missing")

    assert err_401.status_code == 401
    assert err_401.detail == "bad auth"
    assert err_403.status_code == 403
    assert err_403.detail == "bad role"
    assert err_404.status_code == 404
    assert err_404.detail == "missing"


def test_create_access_token_payload() -> None:
    token = create_access_token("subject-1")
    parts = token.split(".")
    assert len(parts) == 3
    assert all(parts)
