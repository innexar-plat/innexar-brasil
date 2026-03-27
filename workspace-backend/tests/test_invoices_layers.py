import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.modules.invoices.controllers.invoice_controller import InvoiceController
from app.modules.invoices.dtos.invoice_dto import CreateInvoiceDto, InvoiceDto, UpdateInvoiceDto
from app.modules.invoices.entities.invoice_entity import InvoiceEntity
from app.modules.invoices.repositories.invoice_repository import InvoiceRepository
from app.modules.invoices.services.invoice_service import InvoiceService

SEED_ID = "50000000-0000-0000-0000-000000000001"


def test_invoice_repository_list() -> None:
    repo = InvoiceRepository()
    items = repo.list_invoices()
    assert len(items) == 1
    assert isinstance(items[0], InvoiceEntity)
    assert items[0].status == "pending"


def test_invoice_repository_get_found() -> None:
    repo = InvoiceRepository()
    item = repo.get_invoice(SEED_ID)
    assert item is not None
    assert item.currency == "BRL"


def test_invoice_repository_get_not_found() -> None:
    repo = InvoiceRepository()
    assert repo.get_invoice("unknown") is None


def test_invoice_repository_create() -> None:
    repo = InvoiceRepository()
    entity = InvoiceEntity(id="new-id", subscription_id="sub-id", amount_cents=9900, currency="BRL", status="pending")
    result = repo.create_invoice(entity)
    assert result.id == "new-id"


def test_invoice_repository_update_found() -> None:
    repo = InvoiceRepository()
    result = repo.update_invoice(SEED_ID, {"status": "overdue"})
    assert result is not None
    assert result.status == "overdue"


def test_invoice_repository_update_not_found() -> None:
    repo = InvoiceRepository()
    assert repo.update_invoice("unknown", {"status": "X"}) is None


def test_invoice_service_list() -> None:
    service = InvoiceService(InvoiceRepository())
    items = service.list_invoices()
    assert len(items) == 1
    assert isinstance(items[0], InvoiceDto)
    assert items[0].amount_cents == 19900


def test_invoice_service_get_found() -> None:
    service = InvoiceService(InvoiceRepository())
    item = service.get_invoice(SEED_ID)
    assert item.id == SEED_ID


def test_invoice_service_get_not_found() -> None:
    service = InvoiceService(InvoiceRepository())
    with pytest.raises(HTTPException) as err:
        service.get_invoice("unknown")
    assert err.value.status_code == 404


def test_invoice_service_create() -> None:
    service = InvoiceService(InvoiceRepository())
    dto = CreateInvoiceDto(subscription_id="sub-id", amount_cents=9900)
    result = service.create_invoice(dto)
    assert isinstance(result, InvoiceDto)


def test_invoice_service_update_found() -> None:
    service = InvoiceService(InvoiceRepository())
    result = service.update_invoice(SEED_ID, UpdateInvoiceDto(status="overdue"))
    assert result.status == "overdue"


def test_invoice_service_update_not_found() -> None:
    service = InvoiceService(InvoiceRepository())
    with pytest.raises(HTTPException) as err:
        service.update_invoice("unknown", UpdateInvoiceDto(status="X"))
    assert err.value.status_code == 404


def test_invoice_controller_list() -> None:
    controller = InvoiceController()
    items = controller.list_invoices()
    assert len(items) == 1
    assert items[0].amount_cents == 19900


def test_invoice_controller_get() -> None:
    controller = InvoiceController()
    item = controller.get_invoice(SEED_ID)
    assert item.currency == "BRL"


def test_invoice_controller_create() -> None:
    controller = InvoiceController()
    dto = CreateInvoiceDto(subscription_id="sub-id", amount_cents=9900)
    result = controller.create_invoice(dto)
    assert isinstance(result, InvoiceDto)


def test_invoice_route_list(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/invoices", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_invoice_route_list_unauthenticated(client: TestClient) -> None:
    response = client.get("/api/v1/invoices")
    assert response.status_code == 403


def test_invoice_route_create(client: TestClient, auth_headers: dict) -> None:
    payload = {"subscription_id": "sub-id", "amount_cents": 9900}
    response = client.post("/api/v1/invoices", json=payload, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["amount_cents"] == 9900


def test_invoice_route_get_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/invoices/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 200


def test_invoice_route_get_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/invoices/unknown", headers=auth_headers)
    assert response.status_code == 404


def test_invoice_route_update_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch(f"/api/v1/invoices/{SEED_ID}", json={"status": "overdue"}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["status"] == "overdue"


def test_invoice_route_update_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch("/api/v1/invoices/unknown", json={"status": "X"}, headers=auth_headers)
    assert response.status_code == 404
