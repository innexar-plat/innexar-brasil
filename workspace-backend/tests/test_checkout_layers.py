import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.main import app
from app.modules.checkout.controllers.checkout_controller import CheckoutController
from app.modules.checkout.dtos.checkout_dto import CheckoutDto, StartCheckoutRequestDto
from app.modules.checkout.entities.checkout_entity import CheckoutEntity
from app.modules.checkout.repositories.checkout_repository import CheckoutRepository
from app.modules.checkout.services.checkout_service import CheckoutService


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


def test_checkout_repository_create_checkout() -> None:
    repo = CheckoutRepository()
    item = repo.create_checkout(
        customer_email="client1@innexar.com",
        product_slug="site-pro",
        amount_cents=19900,
    )

    assert isinstance(item, CheckoutEntity)
    assert item.status == "pending"


def test_checkout_repository_get_checkout_found() -> None:
    repo = CheckoutRepository()
    item = repo.get_checkout("40000000-0000-0000-0000-000000000001")

    assert item is not None
    assert item.product_slug == "site-pro"


def test_checkout_repository_get_checkout_not_found() -> None:
    repo = CheckoutRepository()
    item = repo.get_checkout("unknown")
    assert item is None


def test_checkout_service_start_checkout() -> None:
    service = CheckoutService(CheckoutRepository())
    dto = StartCheckoutRequestDto(
        customer_email="client1@innexar.com",
        product_slug="site-pro",
        amount_cents=19900,
    )

    result = service.start_checkout(dto)
    assert isinstance(result, CheckoutDto)
    assert result.payment_provider == "mercadopago"


def test_checkout_service_get_checkout_found() -> None:
    service = CheckoutService(CheckoutRepository())
    result = service.get_checkout("40000000-0000-0000-0000-000000000001")

    assert result.id == "40000000-0000-0000-0000-000000000001"


def test_checkout_service_get_checkout_not_found() -> None:
    service = CheckoutService(CheckoutRepository())
    with pytest.raises(HTTPException) as err:
        service.get_checkout("unknown")

    assert err.value.status_code == 404


def test_checkout_controller_start_checkout() -> None:
    controller = CheckoutController()
    dto = StartCheckoutRequestDto(
        customer_email="client1@innexar.com",
        product_slug="site-pro",
        amount_cents=19900,
    )

    result = controller.start_checkout(dto)
    assert result.status == "pending"


def test_checkout_controller_get_checkout() -> None:
    controller = CheckoutController()
    result = controller.get_checkout("40000000-0000-0000-0000-000000000001")
    assert result.amount_cents == 19900


def test_checkout_route_start_checkout(client: TestClient) -> None:
    response = client.post(
        "/api/v1/checkout/start",
        json={
            "customer_email": "client1@innexar.com",
            "product_slug": "site-pro",
            "amount_cents": 19900,
        },
    )

    assert response.status_code == 201
    body = response.json()
    assert body["data"]["status"] == "pending"


def test_checkout_route_start_checkout_validation_error(client: TestClient) -> None:
    response = client.post(
        "/api/v1/checkout/start",
        json={
            "customer_email": "invalid-email",
            "product_slug": "",
            "amount_cents": -1,
        },
    )

    assert response.status_code == 422


def test_checkout_route_get_checkout_found(client: TestClient) -> None:
    response = client.get("/api/v1/checkout/40000000-0000-0000-0000-000000000001")

    assert response.status_code == 200
    assert response.json()["id"] == "40000000-0000-0000-0000-000000000001"


def test_checkout_route_get_checkout_not_found(client: TestClient) -> None:
    response = client.get("/api/v1/checkout/unknown")

    assert response.status_code == 404
    assert response.json()["detail"] == "Checkout not found"
