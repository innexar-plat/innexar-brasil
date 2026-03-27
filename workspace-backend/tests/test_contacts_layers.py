import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.modules.contacts.controllers.contact_controller import ContactController
from app.modules.contacts.dtos.contact_dto import ContactDto, CreateContactDto, UpdateContactDto
from app.modules.contacts.entities.contact_entity import ContactEntity
from app.modules.contacts.repositories.contact_repository import ContactRepository
from app.modules.contacts.services.contact_service import ContactService

SEED_ID = "c0000000-0000-0000-0000-000000000001"


def test_contact_repository_list() -> None:
    repo = ContactRepository()
    items = repo.list_contacts()
    assert len(items) == 1
    assert isinstance(items[0], ContactEntity)
    assert items[0].status == "active"


def test_contact_repository_get_found() -> None:
    repo = ContactRepository()
    item = repo.get_contact(SEED_ID)
    assert item is not None
    assert item.email == "maria.silva@innexar.com"


def test_contact_repository_get_not_found() -> None:
    repo = ContactRepository()
    assert repo.get_contact("unknown") is None


def test_contact_repository_create() -> None:
    repo = ContactRepository()
    entity = ContactEntity(id="new-id", name="New Contact", email="new@test.com", phone="+5511999", status="active")
    result = repo.create_contact(entity)
    assert result.id == "new-id"


def test_contact_repository_update_found() -> None:
    repo = ContactRepository()
    result = repo.update_contact(SEED_ID, {"status": "inactive"})
    assert result is not None
    assert result.status == "inactive"


def test_contact_repository_update_not_found() -> None:
    repo = ContactRepository()
    assert repo.update_contact("unknown", {"status": "X"}) is None


def test_contact_repository_delete_found() -> None:
    repo = ContactRepository()
    assert repo.delete_contact(SEED_ID) is True


def test_contact_repository_delete_not_found() -> None:
    repo = ContactRepository()
    assert repo.delete_contact("unknown") is False


def test_contact_service_list() -> None:
    service = ContactService(ContactRepository())
    items = service.list_contacts()
    assert len(items) == 1
    assert isinstance(items[0], ContactDto)
    assert items[0].name == "Maria Silva"


def test_contact_service_get_found() -> None:
    service = ContactService(ContactRepository())
    item = service.get_contact(SEED_ID)
    assert item.id == SEED_ID


def test_contact_service_get_not_found() -> None:
    service = ContactService(ContactRepository())
    with pytest.raises(HTTPException) as err:
        service.get_contact("unknown")
    assert err.value.status_code == 404


def test_contact_service_create() -> None:
    service = ContactService(ContactRepository())
    dto = CreateContactDto(name="New Contact", email="new@test.com", phone="+55119")
    result = service.create_contact(dto)
    assert isinstance(result, ContactDto)


def test_contact_service_update_found() -> None:
    service = ContactService(ContactRepository())
    result = service.update_contact(SEED_ID, UpdateContactDto(status="inactive"))
    assert result.status == "inactive"


def test_contact_service_update_not_found() -> None:
    service = ContactService(ContactRepository())
    with pytest.raises(HTTPException) as err:
        service.update_contact("unknown", UpdateContactDto(status="X"))
    assert err.value.status_code == 404


def test_contact_service_delete_not_found() -> None:
    service = ContactService(ContactRepository())
    with pytest.raises(HTTPException) as err:
        service.delete_contact("unknown")
    assert err.value.status_code == 404


def test_contact_controller_list() -> None:
    controller = ContactController()
    items = controller.list_contacts()
    assert len(items) == 1
    assert items[0].name == "Maria Silva"


def test_contact_controller_get() -> None:
    controller = ContactController()
    item = controller.get_contact(SEED_ID)
    assert item.status == "active"


def test_contact_controller_create() -> None:
    controller = ContactController()
    dto = CreateContactDto(name="New Contact", email="new@test.com", phone="+55119")
    result = controller.create_contact(dto)
    assert isinstance(result, ContactDto)


def test_contact_controller_delete() -> None:
    controller = ContactController()
    controller.delete_contact(SEED_ID)  # Should not raise


def test_contact_route_list(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/contacts", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_contact_route_list_unauthenticated(client: TestClient) -> None:
    response = client.get("/api/v1/contacts")
    assert response.status_code == 403


def test_contact_route_create(client: TestClient, auth_headers: dict) -> None:
    payload = {"name": "New Contact", "email": "new@test.com", "phone": "+55119"}
    response = client.post("/api/v1/contacts", json=payload, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["name"] == "New Contact"


def test_contact_route_get_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/contacts/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 200


def test_contact_route_get_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/contacts/unknown", headers=auth_headers)
    assert response.status_code == 404


def test_contact_route_update_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch(f"/api/v1/contacts/{SEED_ID}", json={"status": "inactive"}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["status"] == "inactive"


def test_contact_route_update_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch("/api/v1/contacts/unknown", json={"status": "X"}, headers=auth_headers)
    assert response.status_code == 404


def test_contact_route_delete_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete(f"/api/v1/contacts/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 204


def test_contact_route_delete_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete("/api/v1/contacts/unknown", headers=auth_headers)
    assert response.status_code == 404
