import asyncio
import pytest

from app.database.base import Base
from app.database import session as session_module


class _DummySession:
    pass


class _DummySessionContext:
    async def __aenter__(self):
        return _DummySession()

    async def __aexit__(self, exc_type, exc, tb):
        return False


def test_get_db_yields_session(monkeypatch) -> None:
    monkeypatch.setattr(session_module, "SessionLocal", lambda: _DummySessionContext())

    async def _run() -> None:
        gen = session_module.get_db()
        yielded = await anext(gen)
        assert isinstance(yielded, _DummySession)

        with pytest.raises(StopAsyncIteration):
            await anext(gen)

    asyncio.run(_run())


def test_base_is_declarative_base() -> None:
    assert hasattr(Base, "metadata")


def test_database_engine_created() -> None:
    assert session_module.engine is not None
