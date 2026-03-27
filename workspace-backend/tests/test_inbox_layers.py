import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.modules.inbox.controllers.inbox_message_controller import InboxMessageController
from app.modules.inbox.dtos.inbox_message_dto import CreateInboxMessageDto, InboxMessageDto, UpdateInboxMessageDto
from app.modules.inbox.entities.inbox_message_entity import InboxMessageEntity
from app.modules.inbox.repositories.inbox_message_repository import InboxMessageRepository
from app.modules.inbox.services.inbox_message_service import InboxMessageService

SEED_ID = "i0000000-0000-0000-0000-000000000001"


def test_inbox_repository_list() -> None:
    repo = InboxMessageRepository()
    items = repo.list_messages()
    assert len(items) == 1
    assert isinstance(items[0], InboxMessageEntity)
    assert items[0].status == "unread"


def test_inbox_repository_get_found() -> None:
    repo = InboxMessageRepository()
    item = repo.get_message(SEED_ID)
    assert item is not None
    assert item.channel == "whatsapp"


def test_inbox_repository_get_not_found() -> None:
    repo = InboxMessageRepository()
    assert repo.get_message("unknown") is None


def test_inbox_repository_create() -> None:
    repo = InboxMessageRepository()
    entity = InboxMessageEntity(id="new-id", contact_id="cid", channel="email", content="Hello", status="unread")
    result = repo.create_message(entity)
    assert result.id == "new-id"


def test_inbox_repository_update_found() -> None:
    repo = InboxMessageRepository()
    result = repo.update_message(SEED_ID, {"status": "read"})
    assert result is not None
    assert result.status == "read"


def test_inbox_repository_update_not_found() -> None:
    repo = InboxMessageRepository()
    assert repo.update_message("unknown", {"status": "X"}) is None


def test_inbox_service_list() -> None:
    service = InboxMessageService(InboxMessageRepository())
    items = service.list_messages()
    assert len(items) == 1
    assert isinstance(items[0], InboxMessageDto)
    assert items[0].status == "unread"


def test_inbox_service_get_found() -> None:
    service = InboxMessageService(InboxMessageRepository())
    item = service.get_message(SEED_ID)
    assert item.id == SEED_ID


def test_inbox_service_get_not_found() -> None:
    service = InboxMessageService(InboxMessageRepository())
    with pytest.raises(HTTPException) as err:
        service.get_message("unknown")
    assert err.value.status_code == 404


def test_inbox_service_create() -> None:
    service = InboxMessageService(InboxMessageRepository())
    dto = CreateInboxMessageDto(contact_id="cid", channel="email", content="Hello")
    result = service.create_message(dto)
    assert isinstance(result, InboxMessageDto)


def test_inbox_service_update_found() -> None:
    service = InboxMessageService(InboxMessageRepository())
    result = service.update_message(SEED_ID, UpdateInboxMessageDto(status="read"))
    assert result.status == "read"


def test_inbox_service_update_not_found() -> None:
    service = InboxMessageService(InboxMessageRepository())
    with pytest.raises(HTTPException) as err:
        service.update_message("unknown", UpdateInboxMessageDto(status="read"))
    assert err.value.status_code == 404


def test_inbox_controller_list() -> None:
    controller = InboxMessageController()
    items = controller.list_messages()
    assert len(items) == 1
    assert items[0].channel == "whatsapp"


def test_inbox_controller_get() -> None:
    controller = InboxMessageController()
    item = controller.get_message(SEED_ID)
    assert item.status == "unread"


def test_inbox_controller_create() -> None:
    controller = InboxMessageController()
    dto = CreateInboxMessageDto(contact_id="cid", channel="email", content="Hello")
    result = controller.create_message(dto)
    assert isinstance(result, InboxMessageDto)


def test_inbox_controller_update() -> None:
    controller = InboxMessageController()
    result = controller.update_message(SEED_ID, UpdateInboxMessageDto(status="read"))
    assert result.status == "read"


def test_inbox_route_list(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/inbox", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_inbox_route_list_unauthenticated(client: TestClient) -> None:
    response = client.get("/api/v1/inbox")
    assert response.status_code == 403


def test_inbox_route_create(client: TestClient, auth_headers: dict) -> None:
    payload = {"contact_id": "cid", "channel": "email", "content": "Hello"}
    response = client.post("/api/v1/inbox", json=payload, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["content"] == "Hello"


def test_inbox_route_get_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/inbox/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["id"] == SEED_ID


def test_inbox_route_get_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/inbox/unknown", headers=auth_headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "Message not found"


def test_inbox_route_update_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch(f"/api/v1/inbox/{SEED_ID}", json={"status": "read"}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["status"] == "read"


def test_inbox_route_update_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch("/api/v1/inbox/unknown", json={"status": "read"}, headers=auth_headers)
    assert response.status_code == 404
