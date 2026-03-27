import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.modules.agent_config.controllers.agent_config_controller import AgentConfigController
from app.modules.agent_config.dtos.agent_config_dto import (
    AgentConfigDto, CreateAgentConfigDto, EngagementPolicyDto, UpdateAgentConfigDto, UpdateEngagementPolicyDto,
)
from app.modules.agent_config.entities.agent_config_entity import AgentConfigEntity, EngagementPolicyEntity
from app.modules.agent_config.repositories.agent_config_repository import AgentConfigRepository
from app.modules.agent_config.services.agent_config_service import AgentConfigService

SEED_ID = "ac000000-0000-0000-0000-000000000001"
POLICY_ID = "ep000000-0000-0000-0000-000000000001"


def test_agent_config_repository_list() -> None:
    repo = AgentConfigRepository()
    items = repo.list_configs()
    assert len(items) == 1
    assert isinstance(items[0], AgentConfigEntity)
    assert items[0].provider == "openai"


def test_agent_config_repository_get_found() -> None:
    repo = AgentConfigRepository()
    item = repo.get_config(SEED_ID)
    assert item is not None
    assert item.model_name == "gpt-4o"


def test_agent_config_repository_get_not_found() -> None:
    repo = AgentConfigRepository()
    assert repo.get_config("unknown") is None


def test_agent_config_repository_create() -> None:
    repo = AgentConfigRepository()
    entity = AgentConfigEntity(
        id="new-id", provider="openai", model_name="gpt-4", api_key_masked="sk-***",
        temperature=0.5, max_tokens=1024, active=True, auto_reply_enabled=False,
        auto_classify_enabled=False, approval_required=True, autonomous_mode=False,
        system_prompt=None, max_cost_per_run_usd=0.05, daily_budget_usd=5.0, updated_at="2026-01-01",
    )
    result = repo.create_config(entity)
    assert result.id == "new-id"


def test_agent_config_repository_update_found() -> None:
    repo = AgentConfigRepository()
    result = repo.update_config(SEED_ID, {"autonomous_mode": True})
    assert result is not None
    assert result.autonomous_mode is True


def test_agent_config_repository_update_not_found() -> None:
    repo = AgentConfigRepository()
    assert repo.update_config("unknown", {"autonomous_mode": True}) is None


def test_agent_config_repository_delete_found() -> None:
    repo = AgentConfigRepository()
    assert repo.delete_config(SEED_ID) is True


def test_agent_config_repository_delete_not_found() -> None:
    repo = AgentConfigRepository()
    assert repo.delete_config("unknown") is False


def test_agent_config_repository_get_policy() -> None:
    repo = AgentConfigRepository()
    policy = repo.get_policy()
    assert isinstance(policy, EngagementPolicyEntity)
    assert policy.mode == "semi"


def test_agent_config_repository_update_policy() -> None:
    repo = AgentConfigRepository()
    result = repo.update_policy({"mode": "full"})
    assert result is not None
    assert result.mode == "full"


def test_agent_config_service_list() -> None:
    service = AgentConfigService(AgentConfigRepository())
    items = service.list_configs()
    assert len(items) == 1
    assert isinstance(items[0], AgentConfigDto)
    assert items[0].auto_reply_enabled is True


def test_agent_config_service_get_found() -> None:
    service = AgentConfigService(AgentConfigRepository())
    item = service.get_config(SEED_ID)
    assert item.autonomous_mode is False


def test_agent_config_service_get_not_found() -> None:
    service = AgentConfigService(AgentConfigRepository())
    with pytest.raises(HTTPException) as err:
        service.get_config("unknown")
    assert err.value.status_code == 404


def test_agent_config_service_create() -> None:
    service = AgentConfigService(AgentConfigRepository())
    dto = CreateAgentConfigDto(provider="openai", model_name="gpt-4", api_key_masked="sk-***")
    result = service.create_config(dto)
    assert isinstance(result, AgentConfigDto)


def test_agent_config_service_update_found() -> None:
    service = AgentConfigService(AgentConfigRepository())
    result = service.update_config(SEED_ID, UpdateAgentConfigDto(autonomous_mode=True))
    assert result.autonomous_mode is True


def test_agent_config_service_update_not_found() -> None:
    service = AgentConfigService(AgentConfigRepository())
    with pytest.raises(HTTPException) as err:
        service.update_config("unknown", UpdateAgentConfigDto(autonomous_mode=True))
    assert err.value.status_code == 404


def test_agent_config_service_delete_not_found() -> None:
    service = AgentConfigService(AgentConfigRepository())
    with pytest.raises(HTTPException) as err:
        service.delete_config("unknown")
    assert err.value.status_code == 404


def test_agent_config_service_get_policy() -> None:
    service = AgentConfigService(AgentConfigRepository())
    policy = service.get_policy()
    assert isinstance(policy, EngagementPolicyDto)
    assert policy.auto_employee_coaching is True


def test_agent_config_service_update_policy() -> None:
    service = AgentConfigService(AgentConfigRepository())
    result = service.update_policy(UpdateEngagementPolicyDto(mode="full"))
    assert result.mode == "full"


def test_agent_config_controller_list() -> None:
    controller = AgentConfigController()
    items = controller.list_configs()
    assert len(items) == 1
    assert items[0].temperature == 0.3


def test_agent_config_controller_get() -> None:
    controller = AgentConfigController()
    item = controller.get_config(SEED_ID)
    assert item.daily_budget_usd == 5.0


def test_agent_config_controller_create() -> None:
    controller = AgentConfigController()
    dto = CreateAgentConfigDto(provider="openai", model_name="gpt-4", api_key_masked="sk-***")
    result = controller.create_config(dto)
    assert isinstance(result, AgentConfigDto)


def test_agent_config_controller_delete() -> None:
    controller = AgentConfigController()
    controller.delete_config(SEED_ID)  # Should not raise


def test_agent_config_controller_get_policy() -> None:
    controller = AgentConfigController()
    policy = controller.get_policy()
    assert policy.allow_price_sharing is True


def test_agent_config_controller_update_policy() -> None:
    controller = AgentConfigController()
    result = controller.update_policy(UpdateEngagementPolicyDto(mode="full"))
    assert result.mode == "full"


def test_agent_config_route_list(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/agent-config", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_agent_config_route_list_unauthenticated(client: TestClient) -> None:
    response = client.get("/api/v1/agent-config")
    assert response.status_code == 403


def test_agent_config_route_create(client: TestClient, auth_headers: dict) -> None:
    payload = {"provider": "openai", "model_name": "gpt-4", "api_key_masked": "sk-***"}
    response = client.post("/api/v1/agent-config", json=payload, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["provider"] == "openai"


def test_agent_config_route_policy(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/agent-config/policy", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["mode"] == "semi"


def test_agent_config_route_update_policy(client: TestClient, auth_headers: dict) -> None:
    response = client.patch("/api/v1/agent-config/policy", json={"mode": "full"}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["mode"] == "full"


def test_agent_config_route_get_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/agent-config/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["model_name"] == "gpt-4o"


def test_agent_config_route_get_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/agent-config/unknown", headers=auth_headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "Agent config not found"


def test_agent_config_route_update_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch(f"/api/v1/agent-config/{SEED_ID}", json={"autonomous_mode": True}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["autonomous_mode"] is True


def test_agent_config_route_update_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch("/api/v1/agent-config/unknown", json={"autonomous_mode": True}, headers=auth_headers)
    assert response.status_code == 404


def test_agent_config_route_delete_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete(f"/api/v1/agent-config/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 204


def test_agent_config_route_delete_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete("/api/v1/agent-config/unknown", headers=auth_headers)
    assert response.status_code == 404
