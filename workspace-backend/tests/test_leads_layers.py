import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.modules.leads.controllers.lead_controller import LeadController
from app.modules.leads.dtos.lead_dto import CreateLeadDto, LeadDto, UpdateLeadDto
from app.modules.leads.entities.lead_entity import LeadEntity
from app.modules.leads.repositories.lead_repository import LeadRepository
from app.modules.leads.services.lead_service import LeadService

SEED_ID = "70000000-0000-0000-0000-000000000001"


def test_lead_repository_list() -> None:
    repo = LeadRepository()
    items = repo.list_leads()
    assert len(items) == 1
    assert isinstance(items[0], LeadEntity)
    assert items[0].status == "new"


def test_lead_repository_get_found() -> None:
    repo = LeadRepository()
    item = repo.get_lead(SEED_ID)
    assert item is not None
    assert item.source == "website"


def test_lead_repository_get_not_found() -> None:
    repo = LeadRepository()
    assert repo.get_lead("unknown") is None


def test_lead_repository_create() -> None:
    repo = LeadRepository()
    entity = LeadEntity(id="new-id", email="new@test.com", name="New Lead", source="ads", status="new")
    result = repo.create_lead(entity)
    assert result.id == "new-id"


def test_lead_repository_update_found() -> None:
    repo = LeadRepository()
    result = repo.update_lead(SEED_ID, {"status": "qualified"})
    assert result is not None
    assert result.status == "qualified"


def test_lead_repository_update_not_found() -> None:
    repo = LeadRepository()
    assert repo.update_lead("unknown", {"status": "X"}) is None


def test_lead_repository_delete_found() -> None:
    repo = LeadRepository()
    assert repo.delete_lead(SEED_ID) is True


def test_lead_repository_delete_not_found() -> None:
    repo = LeadRepository()
    assert repo.delete_lead("unknown") is False


def test_lead_service_list() -> None:
    service = LeadService(LeadRepository())
    items = service.list_leads()
    assert len(items) == 1
    assert isinstance(items[0], LeadDto)
    assert items[0].email == "lead1@innexar.com"


def test_lead_service_get_found() -> None:
    service = LeadService(LeadRepository())
    item = service.get_lead(SEED_ID)
    assert item.id == SEED_ID


def test_lead_service_get_not_found() -> None:
    service = LeadService(LeadRepository())
    with pytest.raises(HTTPException) as err:
        service.get_lead("unknown")
    assert err.value.status_code == 404


def test_lead_service_create() -> None:
    service = LeadService(LeadRepository())
    dto = CreateLeadDto(email="new@test.com", name="New Lead", source="ads")
    result = service.create_lead(dto)
    assert isinstance(result, LeadDto)


def test_lead_service_update_found() -> None:
    service = LeadService(LeadRepository())
    result = service.update_lead(SEED_ID, UpdateLeadDto(status="qualified"))
    assert result.status == "qualified"


def test_lead_service_update_not_found() -> None:
    service = LeadService(LeadRepository())
    with pytest.raises(HTTPException) as err:
        service.update_lead("unknown", UpdateLeadDto(status="X"))
    assert err.value.status_code == 404


def test_lead_service_delete_not_found() -> None:
    service = LeadService(LeadRepository())
    with pytest.raises(HTTPException) as err:
        service.delete_lead("unknown")
    assert err.value.status_code == 404


def test_lead_controller_list() -> None:
    controller = LeadController()
    items = controller.list_leads()
    assert len(items) == 1
    assert items[0].name == "Lead One"


def test_lead_controller_get() -> None:
    controller = LeadController()
    item = controller.get_lead(SEED_ID)
    assert item.status == "new"


def test_lead_controller_create() -> None:
    controller = LeadController()
    dto = CreateLeadDto(email="new@test.com", name="New Lead", source="ads")
    result = controller.create_lead(dto)
    assert isinstance(result, LeadDto)


def test_lead_controller_delete() -> None:
    controller = LeadController()
    controller.delete_lead(SEED_ID)  # Should not raise


def test_lead_route_list(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/leads", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_lead_route_list_unauthenticated(client: TestClient) -> None:
    response = client.get("/api/v1/leads")
    assert response.status_code == 403


def test_lead_route_create(client: TestClient, auth_headers: dict) -> None:
    payload = {"email": "new@test.com", "name": "New Lead", "source": "ads"}
    response = client.post("/api/v1/leads", json=payload, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["name"] == "New Lead"


def test_lead_route_get_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/leads/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["id"] == SEED_ID


def test_lead_route_get_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/leads/unknown", headers=auth_headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "Lead not found"


def test_lead_route_update_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch(f"/api/v1/leads/{SEED_ID}", json={"status": "qualified"}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["status"] == "qualified"


def test_lead_route_update_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch("/api/v1/leads/unknown", json={"status": "X"}, headers=auth_headers)
    assert response.status_code == 404


def test_lead_route_delete_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete(f"/api/v1/leads/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 204


def test_lead_route_delete_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete("/api/v1/leads/unknown", headers=auth_headers)
    assert response.status_code == 404
