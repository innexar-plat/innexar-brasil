import pytest
from app import main


@pytest.mark.asyncio
async def test_initialize_database_with_retries_retries_until_success(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    attempts = 0
    sleep_calls: list[float] = []

    async def fake_initialize_database() -> None:
        nonlocal attempts
        attempts += 1
        if attempts < 3:
            raise ConnectionRefusedError("db unavailable")

    async def fake_sleep(delay: float) -> None:
        sleep_calls.append(delay)

    monkeypatch.setattr(main.settings, "DB_STARTUP_MAX_ATTEMPTS", 3)
    monkeypatch.setattr(main.settings, "DB_STARTUP_RETRY_DELAY_SECONDS", 0.25)
    monkeypatch.setattr(main, "initialize_database", fake_initialize_database)
    monkeypatch.setattr(main.asyncio, "sleep", fake_sleep)

    await main.initialize_database_with_retries()

    assert attempts == 3
    assert sleep_calls == [0.25, 0.25]


@pytest.mark.asyncio
async def test_initialize_database_with_retries_raises_after_max_attempts(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    attempts = 0

    async def fake_initialize_database() -> None:
        nonlocal attempts
        attempts += 1
        raise ConnectionRefusedError("db unavailable")

    async def fake_sleep(_delay: float) -> None:
        return None

    monkeypatch.setattr(main.settings, "DB_STARTUP_MAX_ATTEMPTS", 2)
    monkeypatch.setattr(main.settings, "DB_STARTUP_RETRY_DELAY_SECONDS", 0.0)
    monkeypatch.setattr(main, "initialize_database", fake_initialize_database)
    monkeypatch.setattr(main.asyncio, "sleep", fake_sleep)

    with pytest.raises(ConnectionRefusedError):
        await main.initialize_database_with_retries()

    assert attempts == 2
