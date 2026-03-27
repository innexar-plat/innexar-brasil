import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.modules.customers.controllers.customer_controller import CustomerController
from app.modules.customers.dtos.customer_dto import CreateCustomerDto, CustomerDto, UpdateCustomerDto
from app.modules.customers.entities.customer_entity import CustomerEntity
from app.modules.customers.repositories.customer_repository import CustomerRepository
from app.modules.customers.services.customer_service import CustomerService

SEED_ID = "10000000-0000-0000-0000-000000000001"


def test_customer_repository_list() -> None:
    repo = CustomerRepository()
    items = repo.list_customers()

    assert len(items) == 1
    assert isinstance(items[0], CustomerEntity)
    assert items[0].status == "active"


def test_customer_repository_get_found() -> None:
    repo = CustomerRepository()
    item = repo.get_customer(SEED_ID)

    assert item is not None
    assert item.email == "client1@innexar.com"


def test_customer_repository_get_not_found() -> None:
    repo = CustomerRepository()
    assert repo.get_customer("unknown") is None


def test_customer_repository_create() -> None:
    repo = CustomerRepository()
    entity = CustomerEntity(
        id="new-id", first_name="New", last_name="Customer",
        email="new@test.com", status="active",
    )
    result = repo.create_customer(entity)
    assert result.id == "new-id"


def test_customer_repository_update_found() -> None:
    repo = CustomerRepository()
    result = repo.update_customer(SEED_ID, {"first_name": "Updated"})
    assert result is not None
    assert result.first_name == "Updated"


def test_customer_repository_update_not_found() -> None:
    repo = CustomerRepository()
    assert repo.update_customer("unknown", {"first_name": "X"}) is None


def test_customer_service_list() -> None:
    service = CustomerService(CustomerRepository())
    items = service.list_customers()

    assert len(items) == 1
    assert isinstance(items[0], CustomerDto)
    assert items[0].email == "client1@innexar.com"


def test_customer_service_get_found() -> None:
    service = CustomerService(CustomerRepository())
    item = service.get_customer(SEED_ID)
    assert item.id == SEED_ID


def test_customer_service_get_not_found() -> None:
    service = CustomerService(CustomerRepository())
    with pytest.raises(HTTPException) as err:
        service.get_customer("unknown")
    assert err.value.status_code == 404


def test_customer_service_create() -> None:
    service = CustomerService(CustomerRepository())
    dto = CreateCustomerDto(first_name="New", last_name="Cust", email="new@test.com")
    result = service.create_customer(dto)
    assert isinstance(result, CustomerDto)
    assert result.first_name == "New"


def test_customer_service_update_found() -> None:
    service = CustomerService(CustomerRepository())
    dto = UpdateCustomerDto(first_name="Renamed")
    result = service.update_customer(SEED_ID, dto)
    assert result.first_name == "Renamed"


def test_customer_service_update_not_found() -> None:
    service = CustomerService(CustomerRepository())
    with pytest.raises(HTTPException) as err:
        service.update_customer("unknown", UpdateCustomerDto(first_name="X"))
    assert err.value.status_code == 404


def test_customer_controller_list() -> None:
    controller = CustomerController()
    items = controller.list_customers()
    assert len(items) == 1
    assert items[0].first_name == "Client"


def test_customer_controller_get() -> None:
    controller = CustomerController()
    item = controller.get_customer(SEED_ID)
    assert item.status == "active"


def test_customer_controller_create() -> None:
    controller = CustomerController()
    dto = CreateCustomerDto(first_name="New", last_name="C", email="n@t.com")
    result = controller.create_customer(dto)
    assert isinstance(result, CustomerDto)


def test_customer_controller_update() -> None:
    controller = CustomerController()
    result = controller.update_customer(SEED_ID, UpdateCustomerDto(last_name="Updated"))
    assert result.last_name == "Updated"


def test_customer_route_list(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/customers", headers=auth_headers)
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["id"] == SEED_ID


def test_customer_route_list_unauthenticated(client: TestClient) -> None:
    response = client.get("/api/v1/customers")
    assert response.status_code == 403


def test_customer_route_create(client: TestClient, auth_headers: dict) -> None:
    payload = {"first_name": "Jane", "last_name": "Doe", "email": "jane@test.com"}
    response = client.post("/api/v1/customers", json=payload, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["first_name"] == "Jane"


def test_customer_route_get_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/customers/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["id"] == SEED_ID


def test_customer_route_get_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/customers/unknown", headers=auth_headers)
    assert response.status_code == 404


def test_customer_route_update_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch(f"/api/v1/customers/{SEED_ID}", json={"first_name": "Updated"}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["first_name"] == "Updated"


def test_customer_route_update_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch("/api/v1/customers/unknown", json={"first_name": "X"}, headers=auth_headers)
    assert response.status_code == 404

