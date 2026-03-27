import pytest
from fastapi.testclient import TestClient

from app.core.security import create_access_token
from app.database.session import get_db
from app.main import app


async def _fake_db():
    """
    Yield None so DatabaseAuthRepository falls back to the in-memory stub.
    All other module repositories are also in-memory stubs, so no live DB
    is needed during the test suite.
    """
    yield None


# Replace the real async DB session with the stub-compatible override
app.dependency_overrides[get_db] = _fake_db


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


@pytest.fixture
def auth_headers() -> dict[str, str]:
    token = create_access_token(subject="00000000-0000-0000-0000-000000000001")
    return {"Authorization": f"Bearer {token}"}
