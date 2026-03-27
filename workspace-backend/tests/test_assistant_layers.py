import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.modules.assistant.controllers.assistant_controller import AssistantController
from app.modules.assistant.dtos.assistant_dto import (
    AssistantMessageDto, AssistantSessionDto, CreateAssistantMessageDto, CreateAssistantSessionDto,
)
from app.modules.assistant.entities.assistant_entity import AssistantMessageEntity, AssistantSessionEntity
from app.modules.assistant.repositories.assistant_repository import AssistantRepository
from app.modules.assistant.services.assistant_service import AssistantService

SESSION_ID = "as000000-0000-0000-0000-000000000001"


def test_assistant_repository_list_sessions() -> None:
    repo = AssistantRepository()
    items = repo.list_sessions()
    assert len(items) == 1
    assert isinstance(items[0], AssistantSessionEntity)
    assert items[0].user_id == "u0000000-0000-0000-0000-000000000001"


def test_assistant_repository_get_session_found() -> None:
    repo = AssistantRepository()
    item = repo.get_session(SESSION_ID)
    assert item is not None
    assert item.title == "Sales funnel analysis"


def test_assistant_repository_get_session_not_found() -> None:
    repo = AssistantRepository()
    assert repo.get_session("unknown") is None


def test_assistant_repository_create_session() -> None:
    repo = AssistantRepository()
    entity = AssistantSessionEntity(
        id="new-id", user_id="user-1", title="Test", created_at="2026-01-01", updated_at="2026-01-01"
    )
    result = repo.create_session(entity)
    assert result.id == "new-id"


def test_assistant_repository_delete_session_found() -> None:
    repo = AssistantRepository()
    assert repo.delete_session(SESSION_ID) is True


def test_assistant_repository_delete_session_not_found() -> None:
    repo = AssistantRepository()
    assert repo.delete_session("unknown") is False


def test_assistant_repository_list_messages() -> None:
    repo = AssistantRepository()
    items = repo.list_messages(SESSION_ID)
    assert len(items) == 2
    assert isinstance(items[0], AssistantMessageEntity)
    assert items[0].role == "user"


def test_assistant_repository_list_messages_unknown() -> None:
    repo = AssistantRepository()
    assert repo.list_messages("unknown") == []


def test_assistant_repository_create_message() -> None:
    repo = AssistantRepository()
    entity = AssistantMessageEntity(
        id="msg-id", session_id=SESSION_ID, role="user", content="Hello", created_at="2026-01-01"
    )
    result = repo.create_message(entity)
    assert result.id == "msg-id"


def test_assistant_service_list_sessions() -> None:
    service = AssistantService(AssistantRepository())
    items = service.list_sessions()
    assert len(items) == 1
    assert isinstance(items[0], AssistantSessionDto)


def test_assistant_service_get_session_found() -> None:
    service = AssistantService(AssistantRepository())
    item = service.get_session(SESSION_ID)
    assert item.id == SESSION_ID


def test_assistant_service_get_session_not_found() -> None:
    service = AssistantService(AssistantRepository())
    with pytest.raises(HTTPException) as err:
        service.get_session("unknown")
    assert err.value.status_code == 404


def test_assistant_service_create_session() -> None:
    service = AssistantService(AssistantRepository())
    dto = CreateAssistantSessionDto(user_id="user-1", title="Test")
    result = service.create_session(dto)
    assert isinstance(result, AssistantSessionDto)


def test_assistant_service_delete_session_not_found() -> None:
    service = AssistantService(AssistantRepository())
    with pytest.raises(HTTPException) as err:
        service.delete_session("unknown")
    assert err.value.status_code == 404


def test_assistant_service_list_messages() -> None:
    service = AssistantService(AssistantRepository())
    items = service.list_messages(SESSION_ID)
    assert len(items) == 2
    assert isinstance(items[0], AssistantMessageDto)


def test_assistant_service_create_message() -> None:
    service = AssistantService(AssistantRepository())
    dto = CreateAssistantMessageDto(content="Hello assistant")
    result = service.create_message(SESSION_ID, dto)
    assert isinstance(result, AssistantMessageDto)
    assert result.content == "Hello assistant"


def test_assistant_controller_list_sessions() -> None:
    controller = AssistantController()
    items = controller.list_sessions()
    assert len(items) == 1
    assert items[0].title == "Sales funnel analysis"


def test_assistant_controller_get_session() -> None:
    controller = AssistantController()
    item = controller.get_session(SESSION_ID)
    assert item.user_id == "u0000000-0000-0000-0000-000000000001"


def test_assistant_controller_create_session() -> None:
    controller = AssistantController()
    dto = CreateAssistantSessionDto(user_id="user-1", title="Test")
    result = controller.create_session(dto)
    assert isinstance(result, AssistantSessionDto)


def test_assistant_controller_delete_session() -> None:
    controller = AssistantController()
    controller.delete_session(SESSION_ID)  # Should not raise


def test_assistant_controller_list_messages() -> None:
    controller = AssistantController()
    items = controller.list_messages(SESSION_ID)
    assert len(items) == 2


def test_assistant_controller_create_message() -> None:
    controller = AssistantController()
    dto = CreateAssistantMessageDto(content="Hello")
    result = controller.create_message(SESSION_ID, dto)
    assert isinstance(result, AssistantMessageDto)


def test_assistant_route_list_sessions(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/assistant/sessions", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_assistant_route_list_sessions_unauthenticated(client: TestClient) -> None:
    response = client.get("/api/v1/assistant/sessions")
    assert response.status_code == 403


def test_assistant_route_create_session(client: TestClient, auth_headers: dict) -> None:
    payload = {"user_id": "user-1", "title": "Test"}
    response = client.post("/api/v1/assistant/sessions", json=payload, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["title"] == "Test"


def test_assistant_route_get_session_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/assistant/sessions/{SESSION_ID}", headers=auth_headers)
    assert response.status_code == 200


def test_assistant_route_get_session_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/assistant/sessions/unknown", headers=auth_headers)
    assert response.status_code == 404


def test_assistant_route_delete_session_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete(f"/api/v1/assistant/sessions/{SESSION_ID}", headers=auth_headers)
    assert response.status_code == 204


def test_assistant_route_delete_session_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete("/api/v1/assistant/sessions/unknown", headers=auth_headers)
    assert response.status_code == 404


def test_assistant_route_list_messages(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/assistant/sessions/{SESSION_ID}/messages", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_assistant_route_create_message(client: TestClient, auth_headers: dict) -> None:
    payload = {"content": "Hello assistant", "role": "user"}
    response = client.post(f"/api/v1/assistant/sessions/{SESSION_ID}/messages", json=payload, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["content"] == "Hello assistant"

def test_assistant_service_create_message_invalid_session() -> None:
    service = AssistantService(AssistantRepository())
    dto = CreateAssistantMessageDto(content="Hello")
    with pytest.raises(HTTPException) as err:
        service.create_message("unknown-session", dto)
    assert err.value.status_code == 404
