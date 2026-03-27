import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.modules.campaigns.controllers.campaign_controller import CampaignController
from app.modules.campaigns.dtos.campaign_dto import CampaignDto, CreateCampaignDto, UpdateCampaignDto
from app.modules.campaigns.entities.campaign_entity import CampaignEntity
from app.modules.campaigns.repositories.campaign_repository import CampaignRepository
from app.modules.campaigns.services.campaign_service import CampaignService

SEED_ID = "90000000-0000-0000-0000-000000000001"


def test_campaign_repository_list() -> None:
    repo = CampaignRepository()
    items = repo.list_campaigns()
    assert len(items) == 1
    assert isinstance(items[0], CampaignEntity)
    assert items[0].status == "active"


def test_campaign_repository_get_found() -> None:
    repo = CampaignRepository()
    item = repo.get_campaign(SEED_ID)
    assert item is not None
    assert item.channel == "email"


def test_campaign_repository_get_not_found() -> None:
    repo = CampaignRepository()
    assert repo.get_campaign("unknown") is None


def test_campaign_repository_create() -> None:
    repo = CampaignRepository()
    entity = CampaignEntity(id="new-id", name="New Campaign", channel="email", status="draft")
    result = repo.create_campaign(entity)
    assert result.id == "new-id"


def test_campaign_repository_update_found() -> None:
    repo = CampaignRepository()
    result = repo.update_campaign(SEED_ID, {"status": "paused"})
    assert result is not None
    assert result.status == "paused"


def test_campaign_repository_update_not_found() -> None:
    repo = CampaignRepository()
    assert repo.update_campaign("unknown", {"status": "X"}) is None


def test_campaign_repository_delete_found() -> None:
    repo = CampaignRepository()
    assert repo.delete_campaign(SEED_ID) is True


def test_campaign_repository_delete_not_found() -> None:
    repo = CampaignRepository()
    assert repo.delete_campaign("unknown") is False


def test_campaign_service_list() -> None:
    service = CampaignService(CampaignRepository())
    items = service.list_campaigns()
    assert len(items) == 1
    assert isinstance(items[0], CampaignDto)
    assert items[0].name == "Q1 Retention Boost"


def test_campaign_service_get_found() -> None:
    service = CampaignService(CampaignRepository())
    item = service.get_campaign(SEED_ID)
    assert item.id == SEED_ID


def test_campaign_service_get_not_found() -> None:
    service = CampaignService(CampaignRepository())
    with pytest.raises(HTTPException) as err:
        service.get_campaign("unknown")
    assert err.value.status_code == 404


def test_campaign_service_create() -> None:
    service = CampaignService(CampaignRepository())
    dto = CreateCampaignDto(name="New Campaign", channel="email")
    result = service.create_campaign(dto)
    assert isinstance(result, CampaignDto)


def test_campaign_service_update_found() -> None:
    service = CampaignService(CampaignRepository())
    result = service.update_campaign(SEED_ID, UpdateCampaignDto(status="paused"))
    assert result.status == "paused"


def test_campaign_service_update_not_found() -> None:
    service = CampaignService(CampaignRepository())
    with pytest.raises(HTTPException) as err:
        service.update_campaign("unknown", UpdateCampaignDto(status="X"))
    assert err.value.status_code == 404


def test_campaign_service_delete_not_found() -> None:
    service = CampaignService(CampaignRepository())
    with pytest.raises(HTTPException) as err:
        service.delete_campaign("unknown")
    assert err.value.status_code == 404


def test_campaign_controller_list() -> None:
    controller = CampaignController()
    items = controller.list_campaigns()
    assert len(items) == 1
    assert items[0].name == "Q1 Retention Boost"


def test_campaign_controller_get() -> None:
    controller = CampaignController()
    item = controller.get_campaign(SEED_ID)
    assert item.channel == "email"


def test_campaign_controller_create() -> None:
    controller = CampaignController()
    dto = CreateCampaignDto(name="New Campaign", channel="email")
    result = controller.create_campaign(dto)
    assert isinstance(result, CampaignDto)


def test_campaign_controller_delete() -> None:
    controller = CampaignController()
    controller.delete_campaign(SEED_ID)  # Should not raise


def test_campaign_route_list(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/campaigns", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_campaign_route_list_unauthenticated(client: TestClient) -> None:
    response = client.get("/api/v1/campaigns")
    assert response.status_code == 403


def test_campaign_route_create(client: TestClient, auth_headers: dict) -> None:
    payload = {"name": "New Campaign", "channel": "email"}
    response = client.post("/api/v1/campaigns", json=payload, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["name"] == "New Campaign"


def test_campaign_route_get_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/campaigns/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 200


def test_campaign_route_get_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/campaigns/unknown", headers=auth_headers)
    assert response.status_code == 404


def test_campaign_route_update_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch(f"/api/v1/campaigns/{SEED_ID}", json={"status": "paused"}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["status"] == "paused"


def test_campaign_route_update_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch("/api/v1/campaigns/unknown", json={"status": "X"}, headers=auth_headers)
    assert response.status_code == 404


def test_campaign_route_delete_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete(f"/api/v1/campaigns/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 204


def test_campaign_route_delete_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete("/api/v1/campaigns/unknown", headers=auth_headers)
    assert response.status_code == 404
