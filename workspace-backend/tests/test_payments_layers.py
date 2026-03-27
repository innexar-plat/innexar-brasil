import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.modules.payments.controllers.payment_controller import PaymentController
from app.modules.payments.dtos.payment_dto import CreatePaymentDto, PaymentDto
from app.modules.payments.entities.payment_entity import PaymentEntity
from app.modules.payments.repositories.payment_repository import PaymentRepository
from app.modules.payments.services.payment_service import PaymentService

SEED_ID = "80000000-0000-0000-0000-000000000001"


def test_payment_repository_list() -> None:
    repo = PaymentRepository()
    items = repo.list_payments()
    assert len(items) == 1
    assert isinstance(items[0], PaymentEntity)
    assert items[0].status == "pending"


def test_payment_repository_get_found() -> None:
    repo = PaymentRepository()
    item = repo.get_payment(SEED_ID)
    assert item is not None
    assert item.provider == "mercadopago"


def test_payment_repository_get_not_found() -> None:
    repo = PaymentRepository()
    assert repo.get_payment("unknown") is None


def test_payment_repository_create() -> None:
    repo = PaymentRepository()
    entity = PaymentEntity(id="new-id", invoice_id="inv-id", provider="mercadopago", amount_cents=9900, status="pending")
    result = repo.create_payment(entity)
    assert result.id == "new-id"


def test_payment_service_list() -> None:
    service = PaymentService(PaymentRepository())
    items = service.list_payments()
    assert len(items) == 1
    assert isinstance(items[0], PaymentDto)
    assert items[0].amount_cents == 19900


def test_payment_service_get_found() -> None:
    service = PaymentService(PaymentRepository())
    item = service.get_payment(SEED_ID)
    assert item.id == SEED_ID


def test_payment_service_get_not_found() -> None:
    service = PaymentService(PaymentRepository())
    with pytest.raises(HTTPException) as err:
        service.get_payment("unknown")
    assert err.value.status_code == 404


def test_payment_service_create() -> None:
    service = PaymentService(PaymentRepository())
    dto = CreatePaymentDto(invoice_id="inv-id", provider="mercadopago", amount_cents=9900)
    result = service.create_payment(dto)
    assert isinstance(result, PaymentDto)


def test_payment_controller_list() -> None:
    controller = PaymentController()
    items = controller.list_payments()
    assert len(items) == 1
    assert items[0].provider == "mercadopago"


def test_payment_controller_get() -> None:
    controller = PaymentController()
    item = controller.get_payment(SEED_ID)
    assert item.amount_cents == 19900


def test_payment_controller_create() -> None:
    controller = PaymentController()
    dto = CreatePaymentDto(invoice_id="inv-id", provider="mercadopago", amount_cents=9900)
    result = controller.create_payment(dto)
    assert isinstance(result, PaymentDto)


def test_payment_route_list(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/payments", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_payment_route_list_unauthenticated(client: TestClient) -> None:
    response = client.get("/api/v1/payments")
    assert response.status_code == 403


def test_payment_route_create(client: TestClient, auth_headers: dict) -> None:
    payload = {"invoice_id": "inv-id", "provider": "mercadopago", "amount_cents": 9900}
    response = client.post("/api/v1/payments", json=payload, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["provider"] == "mercadopago"


def test_payment_route_get_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/payments/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 200


def test_payment_route_get_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/payments/unknown", headers=auth_headers)
    assert response.status_code == 404
