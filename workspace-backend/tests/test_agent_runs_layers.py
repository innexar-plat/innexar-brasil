import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.modules.agent_runs.controllers.agent_run_controller import AgentRunController
from app.modules.agent_runs.dtos.agent_run_dto import AgentActionDto, AgentRunDto, CreateAgentRunDto
from app.modules.agent_runs.entities.agent_run_entity import AgentActionEntity, AgentRunEntity
from app.modules.agent_runs.repositories.agent_run_repository import AgentRunRepository
from app.modules.agent_runs.services.agent_run_service import AgentRunService

SEED_ID = "ar000000-0000-0000-0000-000000000001"


def test_agent_run_repository_list() -> None:
    repo = AgentRunRepository()
    items = repo.list_runs()
    assert len(items) == 1
    assert isinstance(items[0], AgentRunEntity)
    assert items[0].status == "completed"


def test_agent_run_repository_get_found() -> None:
    repo = AgentRunRepository()
    item = repo.get_run(SEED_ID)
    assert item is not None
    assert item.run_type == "auto_reply"


def test_agent_run_repository_get_not_found() -> None:
    repo = AgentRunRepository()
    assert repo.get_run("unknown") is None


def test_agent_run_repository_create() -> None:
    repo = AgentRunRepository()
    entity = AgentRunEntity(
        id="new-id", conversation_id="conv-id", run_type="manual", status="pending",
        model_provider=None, model_name=None, tokens_in=0, tokens_out=0,
        cost_usd=0.0, latency_ms=0, created_at="2026-01-01",
    )
    result = repo.create_run(entity)
    assert result.id == "new-id"


def test_agent_run_repository_list_actions() -> None:
    repo = AgentRunRepository()
    items = repo.list_actions(SEED_ID)
    assert len(items) == 1
    assert isinstance(items[0], AgentActionEntity)
    assert items[0].action_type == "send_message"


def test_agent_run_repository_list_actions_unknown() -> None:
    repo = AgentRunRepository()
    assert repo.list_actions("unknown") == []


def test_agent_run_service_list() -> None:
    service = AgentRunService(AgentRunRepository())
    items = service.list_runs()
    assert len(items) == 1
    assert isinstance(items[0], AgentRunDto)
    assert items[0].model_name == "gpt-4o"


def test_agent_run_service_get_found() -> None:
    service = AgentRunService(AgentRunRepository())
    item = service.get_run(SEED_ID)
    assert item.id == SEED_ID


def test_agent_run_service_get_not_found() -> None:
    service = AgentRunService(AgentRunRepository())
    with pytest.raises(HTTPException) as err:
        service.get_run("unknown")
    assert err.value.status_code == 404


def test_agent_run_service_create() -> None:
    service = AgentRunService(AgentRunRepository())
    dto = CreateAgentRunDto(conversation_id="conv-id")
    result = service.create_run(dto)
    assert isinstance(result, AgentRunDto)


def test_agent_run_service_list_actions() -> None:
    service = AgentRunService(AgentRunRepository())
    items = service.list_actions(SEED_ID)
    assert len(items) == 1
    assert isinstance(items[0], AgentActionDto)
    assert items[0].target_type == "conversation"


def test_agent_run_controller_list() -> None:
    controller = AgentRunController()
    items = controller.list_runs()
    assert len(items) == 1
    assert items[0].model_name == "gpt-4o"


def test_agent_run_controller_get() -> None:
    controller = AgentRunController()
    item = controller.get_run(SEED_ID)
    assert item.latency_ms == 840


def test_agent_run_controller_create() -> None:
    controller = AgentRunController()
    dto = CreateAgentRunDto(conversation_id="conv-id")
    result = controller.create_run(dto)
    assert isinstance(result, AgentRunDto)


def test_agent_run_controller_list_actions() -> None:
    controller = AgentRunController()
    items = controller.list_actions(SEED_ID)
    assert len(items) == 1
    assert items[0].target_type == "conversation"


def test_agent_run_route_list(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/agent-runs", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_agent_run_route_list_unauthenticated(client: TestClient) -> None:
    response = client.get("/api/v1/agent-runs")
    assert response.status_code == 403


def test_agent_run_route_create(client: TestClient, auth_headers: dict) -> None:
    payload = {"conversation_id": "conv-id", "run_type": "manual"}
    response = client.post("/api/v1/agent-runs", json=payload, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["conversation_id"] == "conv-id"


def test_agent_run_route_get_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/agent-runs/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["run_type"] == "auto_reply"


def test_agent_run_route_get_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/agent-runs/unknown", headers=auth_headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "Agent run not found"


def test_agent_run_route_actions(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/agent-runs/{SEED_ID}/actions", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1
