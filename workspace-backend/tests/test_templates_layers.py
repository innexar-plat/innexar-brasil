import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.modules.templates.controllers.template_controller import TemplateController
from app.modules.templates.dtos.template_dto import CreateTemplateDto, TemplateDto, UpdateTemplateDto
from app.modules.templates.entities.template_entity import TemplateEntity
from app.modules.templates.repositories.template_repository import TemplateRepository
from app.modules.templates.services.template_service import TemplateService

SEED_ID = "t0000000-0000-0000-0000-000000000001"


def test_template_repository_list() -> None:
    repo = TemplateRepository()
    items = repo.list_templates()
    assert len(items) == 1
    assert isinstance(items[0], TemplateEntity)
    assert items[0].channel == "email"


def test_template_repository_get_found() -> None:
    repo = TemplateRepository()
    item = repo.get_template(SEED_ID)
    assert item is not None
    assert item.status == "active"


def test_template_repository_get_not_found() -> None:
    repo = TemplateRepository()
    assert repo.get_template("unknown") is None


def test_template_repository_create() -> None:
    repo = TemplateRepository()
    entity = TemplateEntity(id="new-id", name="New Template", channel="email", content="Hello", status="draft")
    result = repo.create_template(entity)
    assert result.id == "new-id"


def test_template_repository_update_found() -> None:
    repo = TemplateRepository()
    result = repo.update_template(SEED_ID, {"status": "archived"})
    assert result is not None
    assert result.status == "archived"


def test_template_repository_update_not_found() -> None:
    repo = TemplateRepository()
    assert repo.update_template("unknown", {"status": "X"}) is None


def test_template_repository_delete_found() -> None:
    repo = TemplateRepository()
    assert repo.delete_template(SEED_ID) is True


def test_template_repository_delete_not_found() -> None:
    repo = TemplateRepository()
    assert repo.delete_template("unknown") is False


def test_template_service_list() -> None:
    service = TemplateService(TemplateRepository())
    items = service.list_templates()
    assert len(items) == 1
    assert isinstance(items[0], TemplateDto)
    assert items[0].name == "Welcome Email"


def test_template_service_get_found() -> None:
    service = TemplateService(TemplateRepository())
    item = service.get_template(SEED_ID)
    assert item.id == SEED_ID


def test_template_service_get_not_found() -> None:
    service = TemplateService(TemplateRepository())
    with pytest.raises(HTTPException) as err:
        service.get_template("unknown")
    assert err.value.status_code == 404


def test_template_service_create() -> None:
    service = TemplateService(TemplateRepository())
    dto = CreateTemplateDto(name="New Template", channel="email", content="Hello")
    result = service.create_template(dto)
    assert isinstance(result, TemplateDto)


def test_template_service_update_found() -> None:
    service = TemplateService(TemplateRepository())
    result = service.update_template(SEED_ID, UpdateTemplateDto(status="archived"))
    assert result.status == "archived"


def test_template_service_update_not_found() -> None:
    service = TemplateService(TemplateRepository())
    with pytest.raises(HTTPException) as err:
        service.update_template("unknown", UpdateTemplateDto(status="X"))
    assert err.value.status_code == 404


def test_template_service_delete_not_found() -> None:
    service = TemplateService(TemplateRepository())
    with pytest.raises(HTTPException) as err:
        service.delete_template("unknown")
    assert err.value.status_code == 404


def test_template_controller_list() -> None:
    controller = TemplateController()
    items = controller.list_templates()
    assert len(items) == 1
    assert items[0].name == "Welcome Email"


def test_template_controller_get() -> None:
    controller = TemplateController()
    item = controller.get_template(SEED_ID)
    assert item.channel == "email"


def test_template_controller_create() -> None:
    controller = TemplateController()
    dto = CreateTemplateDto(name="New Template", channel="email", content="Hello")
    result = controller.create_template(dto)
    assert isinstance(result, TemplateDto)


def test_template_controller_delete() -> None:
    controller = TemplateController()
    controller.delete_template(SEED_ID)  # Should not raise


def test_template_route_list(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/templates", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_template_route_list_unauthenticated(client: TestClient) -> None:
    response = client.get("/api/v1/templates")
    assert response.status_code == 403


def test_template_route_create(client: TestClient, auth_headers: dict) -> None:
    payload = {"name": "New Template", "channel": "email", "content": "Hello"}
    response = client.post("/api/v1/templates", json=payload, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["name"] == "New Template"


def test_template_route_get_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/templates/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 200


def test_template_route_get_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/templates/unknown", headers=auth_headers)
    assert response.status_code == 404


def test_template_route_update_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch(f"/api/v1/templates/{SEED_ID}", json={"status": "archived"}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["status"] == "archived"


def test_template_route_update_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch("/api/v1/templates/unknown", json={"status": "X"}, headers=auth_headers)
    assert response.status_code == 404


def test_template_route_delete_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete(f"/api/v1/templates/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 204


def test_template_route_delete_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete("/api/v1/templates/unknown", headers=auth_headers)
    assert response.status_code == 404
