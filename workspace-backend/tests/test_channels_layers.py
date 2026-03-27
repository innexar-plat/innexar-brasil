import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.modules.channels.controllers.channel_controller import ChannelController
from app.modules.channels.dtos.channel_dto import ChannelAccountDto, CreateChannelDto, SyncJobDto, SyncStatusDto, UpdateChannelDto
from app.modules.channels.entities.channel_entity import ChannelAccountEntity, SyncJobEntity, SyncStatusEntity
from app.modules.channels.repositories.channel_repository import ChannelRepository
from app.modules.channels.services.channel_service import ChannelService

SEED_ID = "ch000000-0000-0000-0000-000000000001"


def test_channel_repository_list_accounts() -> None:
    repo = ChannelRepository()
    items = repo.list_accounts()
    assert len(items) == 1
    assert isinstance(items[0], ChannelAccountEntity)
    assert items[0].provider == "evolution"


def test_channel_repository_get_account_found() -> None:
    repo = ChannelRepository()
    item = repo.get_account(SEED_ID)
    assert item is not None
    assert item.status == "connected"


def test_channel_repository_get_account_not_found() -> None:
    repo = ChannelRepository()
    assert repo.get_account("unknown") is None


def test_channel_repository_create_account() -> None:
    repo = ChannelRepository()
    entity = ChannelAccountEntity(
        id="new-id", provider="evolution", instance_name="test", phone_number=None,
        status="pending", active=False, is_ai_instance=False, agent_mode="manual", created_at="2026-01-01",
    )
    result = repo.create_account(entity)
    assert result.id == "new-id"


def test_channel_repository_update_account_found() -> None:
    repo = ChannelRepository()
    result = repo.update_account(SEED_ID, {"status": "disconnected"})
    assert result is not None
    assert result.status == "disconnected"


def test_channel_repository_update_account_not_found() -> None:
    repo = ChannelRepository()
    assert repo.update_account("unknown", {"status": "X"}) is None


def test_channel_repository_delete_account_found() -> None:
    repo = ChannelRepository()
    assert repo.delete_account(SEED_ID) is True


def test_channel_repository_delete_account_not_found() -> None:
    repo = ChannelRepository()
    assert repo.delete_account("unknown") is False


def test_channel_repository_get_sync_status_found() -> None:
    repo = ChannelRepository()
    item = repo.get_sync_status(SEED_ID)
    assert item is not None
    assert isinstance(item, SyncStatusEntity)
    assert item.sync_health == "ready"


def test_channel_repository_get_sync_status_not_found() -> None:
    repo = ChannelRepository()
    assert repo.get_sync_status("unknown") is None


def test_channel_repository_list_sync_jobs() -> None:
    repo = ChannelRepository()
    items = repo.list_sync_jobs(SEED_ID)
    assert len(items) == 1
    assert isinstance(items[0], SyncJobEntity)
    assert items[0].job_type == "full_sync"


def test_channel_repository_list_sync_jobs_unknown() -> None:
    repo = ChannelRepository()
    assert repo.list_sync_jobs("unknown") == []


def test_channel_service_list_accounts() -> None:
    service = ChannelService(ChannelRepository())
    items = service.list_accounts()
    assert len(items) == 1
    assert isinstance(items[0], ChannelAccountDto)


def test_channel_service_get_account_found() -> None:
    service = ChannelService(ChannelRepository())
    item = service.get_account(SEED_ID)
    assert item.active is True


def test_channel_service_get_account_not_found() -> None:
    service = ChannelService(ChannelRepository())
    with pytest.raises(HTTPException) as err:
        service.get_account("unknown")
    assert err.value.status_code == 404


def test_channel_service_create_account() -> None:
    service = ChannelService(ChannelRepository())
    dto = CreateChannelDto(provider="evolution", instance_name="test")
    result = service.create_account(dto)
    assert isinstance(result, ChannelAccountDto)


def test_channel_service_update_account_found() -> None:
    service = ChannelService(ChannelRepository())
    result = service.update_account(SEED_ID, UpdateChannelDto(status="disconnected"))
    assert result.status == "disconnected"


def test_channel_service_update_account_not_found() -> None:
    service = ChannelService(ChannelRepository())
    with pytest.raises(HTTPException) as err:
        service.update_account("unknown", UpdateChannelDto(status="X"))
    assert err.value.status_code == 404


def test_channel_service_delete_account_not_found() -> None:
    service = ChannelService(ChannelRepository())
    with pytest.raises(HTTPException) as err:
        service.delete_account("unknown")
    assert err.value.status_code == 404


def test_channel_service_get_sync_status_found() -> None:
    service = ChannelService(ChannelRepository())
    item = service.get_sync_status(SEED_ID)
    assert isinstance(item, SyncStatusDto)
    assert item.pending_jobs == 0


def test_channel_service_get_sync_status_not_found() -> None:
    service = ChannelService(ChannelRepository())
    with pytest.raises(HTTPException) as err:
        service.get_sync_status("unknown")
    assert err.value.status_code == 404


def test_channel_service_list_sync_jobs() -> None:
    service = ChannelService(ChannelRepository())
    items = service.list_sync_jobs(SEED_ID)
    assert len(items) == 1
    assert isinstance(items[0], SyncJobDto)


def test_channel_controller_list_accounts() -> None:
    controller = ChannelController()
    items = controller.list_accounts()
    assert len(items) == 1
    assert items[0].instance_name == "innexar-main"


def test_channel_controller_get_account() -> None:
    controller = ChannelController()
    item = controller.get_account(SEED_ID)
    assert item.is_ai_instance is False


def test_channel_controller_create_account() -> None:
    controller = ChannelController()
    dto = CreateChannelDto(provider="evolution", instance_name="test")
    result = controller.create_account(dto)
    assert isinstance(result, ChannelAccountDto)


def test_channel_controller_delete_account() -> None:
    controller = ChannelController()
    controller.delete_account(SEED_ID)  # Should not raise


def test_channel_controller_get_sync_status() -> None:
    controller = ChannelController()
    item = controller.get_sync_status(SEED_ID)
    assert item.messages_live == 12


def test_channel_controller_list_sync_jobs() -> None:
    controller = ChannelController()
    items = controller.list_sync_jobs(SEED_ID)
    assert len(items) == 1


def test_channel_route_list(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/channels", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_channel_route_list_unauthenticated(client: TestClient) -> None:
    response = client.get("/api/v1/channels")
    assert response.status_code == 403


def test_channel_route_create(client: TestClient, auth_headers: dict) -> None:
    payload = {"provider": "evolution", "instance_name": "test"}
    response = client.post("/api/v1/channels", json=payload, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["provider"] == "evolution"


def test_channel_route_get_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/channels/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["provider"] == "evolution"


def test_channel_route_get_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/channels/unknown", headers=auth_headers)
    assert response.status_code == 404


def test_channel_route_update_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch(f"/api/v1/channels/{SEED_ID}", json={"status": "disconnected"}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["status"] == "disconnected"


def test_channel_route_update_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch("/api/v1/channels/unknown", json={"status": "X"}, headers=auth_headers)
    assert response.status_code == 404


def test_channel_route_delete_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete(f"/api/v1/channels/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 204


def test_channel_route_delete_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete("/api/v1/channels/unknown", headers=auth_headers)
    assert response.status_code == 404


def test_channel_route_sync_status(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/channels/{SEED_ID}/sync-status", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["sync_health"] == "ready"


def test_channel_route_sync_status_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/channels/unknown/sync-status", headers=auth_headers)
    assert response.status_code == 404


def test_channel_route_sync_jobs(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/channels/{SEED_ID}/sync-jobs", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1
