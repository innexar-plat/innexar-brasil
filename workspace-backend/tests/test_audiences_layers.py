import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.modules.audiences.controllers.audience_controller import AudienceController
from app.modules.audiences.dtos.audience_dto import AudienceDto, CreateAudienceDto, UpdateAudienceDto
from app.modules.audiences.entities.audience_entity import AudienceEntity
from app.modules.audiences.repositories.audience_repository import AudienceRepository
from app.modules.audiences.services.audience_service import AudienceService

SEED_ID = "a0000000-0000-0000-0000-000000000001"


def test_audience_repository_list() -> None:
    repo = AudienceRepository()
    items = repo.list_audiences()
    assert len(items) == 1
    assert isinstance(items[0], AudienceEntity)
    assert items[0].status == "active"


def test_audience_repository_get_found() -> None:
    repo = AudienceRepository()
    item = repo.get_audience(SEED_ID)
    assert item is not None
    assert item.segment == "subscription"


def test_audience_repository_get_not_found() -> None:
    repo = AudienceRepository()
    assert repo.get_audience("unknown") is None


def test_audience_repository_create() -> None:
    repo = AudienceRepository()
    entity = AudienceEntity(id="new-id", name="New Audience", segment="cold", status="active")
    result = repo.create_audience(entity)
    assert result.id == "new-id"


def test_audience_repository_update_found() -> None:
    repo = AudienceRepository()
    result = repo.update_audience(SEED_ID, {"status": "inactive"})
    assert result is not None
    assert result.status == "inactive"


def test_audience_repository_update_not_found() -> None:
    repo = AudienceRepository()
    assert repo.update_audience("unknown", {"status": "X"}) is None


def test_audience_repository_delete_found() -> None:
    repo = AudienceRepository()
    assert repo.delete_audience(SEED_ID) is True


def test_audience_repository_delete_not_found() -> None:
    repo = AudienceRepository()
    assert repo.delete_audience("unknown") is False


def test_audience_service_list() -> None:
    service = AudienceService(AudienceRepository())
    items = service.list_audiences()
    assert len(items) == 1
    assert isinstance(items[0], AudienceDto)
    assert items[0].name == "Active Subscribers"


def test_audience_service_get_found() -> None:
    service = AudienceService(AudienceRepository())
    item = service.get_audience(SEED_ID)
    assert item.id == SEED_ID


def test_audience_service_get_not_found() -> None:
    service = AudienceService(AudienceRepository())
    with pytest.raises(HTTPException) as err:
        service.get_audience("unknown")
    assert err.value.status_code == 404


def test_audience_service_create() -> None:
    service = AudienceService(AudienceRepository())
    dto = CreateAudienceDto(name="New Audience", segment="cold")
    result = service.create_audience(dto)
    assert isinstance(result, AudienceDto)


def test_audience_service_update_found() -> None:
    service = AudienceService(AudienceRepository())
    result = service.update_audience(SEED_ID, UpdateAudienceDto(status="inactive"))
    assert result.status == "inactive"


def test_audience_service_update_not_found() -> None:
    service = AudienceService(AudienceRepository())
    with pytest.raises(HTTPException) as err:
        service.update_audience("unknown", UpdateAudienceDto(status="X"))
    assert err.value.status_code == 404


def test_audience_service_delete_not_found() -> None:
    service = AudienceService(AudienceRepository())
    with pytest.raises(HTTPException) as err:
        service.delete_audience("unknown")
    assert err.value.status_code == 404


def test_audience_controller_list() -> None:
    controller = AudienceController()
    items = controller.list_audiences()
    assert len(items) == 1
    assert items[0].name == "Active Subscribers"


def test_audience_controller_get() -> None:
    controller = AudienceController()
    item = controller.get_audience(SEED_ID)
    assert item.segment == "subscription"


def test_audience_controller_create() -> None:
    controller = AudienceController()
    dto = CreateAudienceDto(name="New Audience", segment="cold")
    result = controller.create_audience(dto)
    assert isinstance(result, AudienceDto)


def test_audience_controller_delete() -> None:
    controller = AudienceController()
    controller.delete_audience(SEED_ID)  # Should not raise


def test_audience_route_list(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/audiences", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_audience_route_list_unauthenticated(client: TestClient) -> None:
    response = client.get("/api/v1/audiences")
    assert response.status_code == 403


def test_audience_route_create(client: TestClient, auth_headers: dict) -> None:
    payload = {"name": "New Audience", "segment": "cold"}
    response = client.post("/api/v1/audiences", json=payload, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["name"] == "New Audience"


def test_audience_route_get_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/audiences/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 200


def test_audience_route_get_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/audiences/unknown", headers=auth_headers)
    assert response.status_code == 404


def test_audience_route_update_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch(f"/api/v1/audiences/{SEED_ID}", json={"status": "inactive"}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["status"] == "inactive"


def test_audience_route_update_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch("/api/v1/audiences/unknown", json={"status": "X"}, headers=auth_headers)
    assert response.status_code == 404


def test_audience_route_delete_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete(f"/api/v1/audiences/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 204


def test_audience_route_delete_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete("/api/v1/audiences/unknown", headers=auth_headers)
    assert response.status_code == 404
