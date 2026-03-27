import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.modules.crm.controllers.crm_controller import CrmController
from app.modules.crm.dtos.crm_dto import (
    CreateCrmDealDto, CreateCrmLeadDto, CrmDealDto, CrmLeadDto, CrmPipelineDto,
    UpdateCrmDealDto, UpdateCrmLeadDto,
)
from app.modules.crm.entities.crm_entity import CrmDealEntity, CrmLeadEntity, CrmPipelineEntity
from app.modules.crm.repositories.crm_repository import CrmRepository
from app.modules.crm.services.crm_service import CrmService

LEAD_ID = "cl000000-0000-0000-0000-000000000001"
DEAL_ID = "cd000000-0000-0000-0000-000000000001"
PIPELINE_ID = "cp000000-0000-0000-0000-000000000001"


def test_crm_repository_list_leads() -> None:
    repo = CrmRepository()
    items = repo.list_leads()
    assert len(items) == 1
    assert isinstance(items[0], CrmLeadEntity)
    assert items[0].status == "qualified"


def test_crm_repository_get_lead_found() -> None:
    repo = CrmRepository()
    item = repo.get_lead(LEAD_ID)
    assert item is not None
    assert item.score == 72


def test_crm_repository_get_lead_not_found() -> None:
    repo = CrmRepository()
    assert repo.get_lead("unknown") is None


def test_crm_repository_create_lead() -> None:
    repo = CrmRepository()
    entity = CrmLeadEntity(id="new-id", name="New Lead", email=None, phone=None, source=None, status="new", score=None, created_at="2026-01-01")
    result = repo.create_lead(entity)
    assert result.id == "new-id"


def test_crm_repository_update_lead_found() -> None:
    repo = CrmRepository()
    result = repo.update_lead(LEAD_ID, {"status": "converted"})
    assert result is not None
    assert result.status == "converted"


def test_crm_repository_update_lead_not_found() -> None:
    repo = CrmRepository()
    assert repo.update_lead("unknown", {"status": "X"}) is None


def test_crm_repository_delete_lead_found() -> None:
    repo = CrmRepository()
    assert repo.delete_lead(LEAD_ID) is True


def test_crm_repository_delete_lead_not_found() -> None:
    repo = CrmRepository()
    assert repo.delete_lead("unknown") is False


def test_crm_repository_list_deals() -> None:
    repo = CrmRepository()
    items = repo.list_deals()
    assert len(items) == 1
    assert isinstance(items[0], CrmDealEntity)
    assert items[0].value == 199.0


def test_crm_repository_get_deal_found() -> None:
    repo = CrmRepository()
    item = repo.get_deal(DEAL_ID)
    assert item is not None
    assert item.status == "open"


def test_crm_repository_get_deal_not_found() -> None:
    repo = CrmRepository()
    assert repo.get_deal("unknown") is None


def test_crm_repository_create_deal() -> None:
    repo = CrmRepository()
    entity = CrmDealEntity(id="new-id", title="New Deal", value=100.0, stage_id=None, lead_id=None, closing_date=None, status="open", created_at="2026-01-01")
    result = repo.create_deal(entity)
    assert result.id == "new-id"


def test_crm_repository_update_deal_found() -> None:
    repo = CrmRepository()
    result = repo.update_deal(DEAL_ID, {"status": "won"})
    assert result is not None
    assert result.status == "won"


def test_crm_repository_update_deal_not_found() -> None:
    repo = CrmRepository()
    assert repo.update_deal("unknown", {"status": "X"}) is None


def test_crm_repository_delete_deal_found() -> None:
    repo = CrmRepository()
    assert repo.delete_deal(DEAL_ID) is True


def test_crm_repository_delete_deal_not_found() -> None:
    repo = CrmRepository()
    assert repo.delete_deal("unknown") is False


def test_crm_repository_list_pipelines() -> None:
    repo = CrmRepository()
    items = repo.list_pipelines()
    assert len(items) == 1
    assert isinstance(items[0], CrmPipelineEntity)
    assert len(items[0].stages) == 3


def test_crm_repository_get_pipeline_found() -> None:
    repo = CrmRepository()
    item = repo.get_pipeline(PIPELINE_ID)
    assert item is not None
    assert item.name == "Sales Pipeline"


def test_crm_repository_get_pipeline_not_found() -> None:
    repo = CrmRepository()
    assert repo.get_pipeline("unknown") is None


def test_crm_service_list_leads() -> None:
    service = CrmService(CrmRepository())
    items = service.list_leads()
    assert len(items) == 1
    assert isinstance(items[0], CrmLeadDto)


def test_crm_service_get_lead_found() -> None:
    service = CrmService(CrmRepository())
    item = service.get_lead(LEAD_ID)
    assert item.source == "website"


def test_crm_service_get_lead_not_found() -> None:
    service = CrmService(CrmRepository())
    with pytest.raises(HTTPException) as err:
        service.get_lead("unknown")
    assert err.value.status_code == 404


def test_crm_service_create_lead() -> None:
    service = CrmService(CrmRepository())
    dto = CreateCrmLeadDto(name="New Lead")
    result = service.create_lead(dto)
    assert isinstance(result, CrmLeadDto)


def test_crm_service_update_lead_found() -> None:
    service = CrmService(CrmRepository())
    result = service.update_lead(LEAD_ID, UpdateCrmLeadDto(status="converted"))
    assert result.status == "converted"


def test_crm_service_update_lead_not_found() -> None:
    service = CrmService(CrmRepository())
    with pytest.raises(HTTPException) as err:
        service.update_lead("unknown", UpdateCrmLeadDto(status="X"))
    assert err.value.status_code == 404


def test_crm_service_delete_lead_not_found() -> None:
    service = CrmService(CrmRepository())
    with pytest.raises(HTTPException) as err:
        service.delete_lead("unknown")
    assert err.value.status_code == 404


def test_crm_service_list_deals() -> None:
    service = CrmService(CrmRepository())
    items = service.list_deals()
    assert len(items) == 1
    assert isinstance(items[0], CrmDealDto)


def test_crm_service_get_deal_found() -> None:
    service = CrmService(CrmRepository())
    item = service.get_deal(DEAL_ID)
    assert item.closing_date == "2026-04-01"


def test_crm_service_get_deal_not_found() -> None:
    service = CrmService(CrmRepository())
    with pytest.raises(HTTPException) as err:
        service.get_deal("unknown")
    assert err.value.status_code == 404


def test_crm_service_create_deal() -> None:
    service = CrmService(CrmRepository())
    dto = CreateCrmDealDto(title="New Deal")
    result = service.create_deal(dto)
    assert isinstance(result, CrmDealDto)


def test_crm_service_update_deal_found() -> None:
    service = CrmService(CrmRepository())
    result = service.update_deal(DEAL_ID, UpdateCrmDealDto(status="won"))
    assert result.status == "won"


def test_crm_service_update_deal_not_found() -> None:
    service = CrmService(CrmRepository())
    with pytest.raises(HTTPException) as err:
        service.update_deal("unknown", UpdateCrmDealDto(status="X"))
    assert err.value.status_code == 404


def test_crm_service_delete_deal_not_found() -> None:
    service = CrmService(CrmRepository())
    with pytest.raises(HTTPException) as err:
        service.delete_deal("unknown")
    assert err.value.status_code == 404


def test_crm_service_list_pipelines() -> None:
    service = CrmService(CrmRepository())
    items = service.list_pipelines()
    assert len(items) == 1
    assert isinstance(items[0], CrmPipelineDto)
    assert len(items[0].stages) == 3


def test_crm_service_get_pipeline_found() -> None:
    service = CrmService(CrmRepository())
    item = service.get_pipeline(PIPELINE_ID)
    assert item.stages[0].name == "Proposal"


def test_crm_service_get_pipeline_not_found() -> None:
    service = CrmService(CrmRepository())
    with pytest.raises(HTTPException) as err:
        service.get_pipeline("unknown")
    assert err.value.status_code == 404


def test_crm_controller_list_leads() -> None:
    controller = CrmController()
    items = controller.list_leads()
    assert len(items) == 1
    assert items[0].name == "João Oliveira"


def test_crm_controller_get_lead() -> None:
    controller = CrmController()
    item = controller.get_lead(LEAD_ID)
    assert item.score == 72


def test_crm_controller_create_lead() -> None:
    controller = CrmController()
    dto = CreateCrmLeadDto(name="New Lead")
    result = controller.create_lead(dto)
    assert isinstance(result, CrmLeadDto)


def test_crm_controller_delete_lead() -> None:
    controller = CrmController()
    controller.delete_lead(LEAD_ID)  # Should not raise


def test_crm_controller_list_deals() -> None:
    controller = CrmController()
    items = controller.list_deals()
    assert len(items) == 1


def test_crm_controller_get_deal() -> None:
    controller = CrmController()
    item = controller.get_deal(DEAL_ID)
    assert item.title == "Site Pro — João Oliveira"


def test_crm_controller_create_deal() -> None:
    controller = CrmController()
    dto = CreateCrmDealDto(title="New Deal")
    result = controller.create_deal(dto)
    assert isinstance(result, CrmDealDto)


def test_crm_controller_delete_deal() -> None:
    controller = CrmController()
    controller.delete_deal(DEAL_ID)  # Should not raise


def test_crm_controller_list_pipelines() -> None:
    controller = CrmController()
    items = controller.list_pipelines()
    assert len(items) == 1


def test_crm_controller_get_pipeline() -> None:
    controller = CrmController()
    item = controller.get_pipeline(PIPELINE_ID)
    assert len(item.stages) == 3


def test_crm_route_list_leads(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/crm/leads", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_crm_route_list_leads_unauthenticated(client: TestClient) -> None:
    response = client.get("/api/v1/crm/leads")
    assert response.status_code == 403


def test_crm_route_create_lead(client: TestClient, auth_headers: dict) -> None:
    payload = {"name": "New Lead"}
    response = client.post("/api/v1/crm/leads", json=payload, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["name"] == "New Lead"


def test_crm_route_get_lead_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/crm/leads/{LEAD_ID}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["status"] == "qualified"


def test_crm_route_get_lead_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/crm/leads/unknown", headers=auth_headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "CRM lead not found"


def test_crm_route_update_lead_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch(f"/api/v1/crm/leads/{LEAD_ID}", json={"status": "converted"}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["status"] == "converted"


def test_crm_route_update_lead_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch("/api/v1/crm/leads/unknown", json={"status": "X"}, headers=auth_headers)
    assert response.status_code == 404


def test_crm_route_delete_lead_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete(f"/api/v1/crm/leads/{LEAD_ID}", headers=auth_headers)
    assert response.status_code == 204


def test_crm_route_delete_lead_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete("/api/v1/crm/leads/unknown", headers=auth_headers)
    assert response.status_code == 404


def test_crm_route_list_deals(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/crm/deals", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_crm_route_create_deal(client: TestClient, auth_headers: dict) -> None:
    payload = {"title": "New Deal"}
    response = client.post("/api/v1/crm/deals", json=payload, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["title"] == "New Deal"


def test_crm_route_get_deal_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/crm/deals/{DEAL_ID}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["value"] == 199.0


def test_crm_route_get_deal_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/crm/deals/unknown", headers=auth_headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "CRM deal not found"


def test_crm_route_update_deal_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch(f"/api/v1/crm/deals/{DEAL_ID}", json={"status": "won"}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["status"] == "won"


def test_crm_route_update_deal_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch("/api/v1/crm/deals/unknown", json={"status": "X"}, headers=auth_headers)
    assert response.status_code == 404


def test_crm_route_delete_deal_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete(f"/api/v1/crm/deals/{DEAL_ID}", headers=auth_headers)
    assert response.status_code == 204


def test_crm_route_delete_deal_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete("/api/v1/crm/deals/unknown", headers=auth_headers)
    assert response.status_code == 404


def test_crm_route_list_pipelines(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/crm/pipelines", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_crm_route_get_pipeline_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/crm/pipelines/{PIPELINE_ID}", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()["stages"]) == 3


def test_crm_route_get_pipeline_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/crm/pipelines/unknown", headers=auth_headers)
    assert response.status_code == 404
    assert response.json()["detail"] == "CRM pipeline not found"
