import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.modules.subscriptions.controllers.subscription_controller import SubscriptionController
from app.modules.subscriptions.dtos.subscription_dto import CreateSubscriptionDto, SubscriptionDto, UpdateSubscriptionDto
from app.modules.subscriptions.entities.subscription_entity import SubscriptionEntity
from app.modules.subscriptions.repositories.subscription_repository import SubscriptionRepository
from app.modules.subscriptions.services.subscription_service import SubscriptionService

SEED_ID = "30000000-0000-0000-0000-000000000001"


def test_subscription_repository_list() -> None:
    repo = SubscriptionRepository()
    items = repo.list_subscriptions()
    assert len(items) == 1
    assert isinstance(items[0], SubscriptionEntity)
    assert items[0].status == "active"


def test_subscription_repository_get_found() -> None:
    repo = SubscriptionRepository()
    item = repo.get_subscription(SEED_ID)
    assert item is not None
    assert item.interval == "month"


def test_subscription_repository_get_not_found() -> None:
    repo = SubscriptionRepository()
    assert repo.get_subscription("unknown") is None


def test_subscription_repository_create() -> None:
    repo = SubscriptionRepository()
    entity = SubscriptionEntity(
        id="new-id", customer_id="cid", product_slug="site-pro",
        status="active", interval="month", amount_cents=19900,
    )
    result = repo.create_subscription(entity)
    assert result.id == "new-id"


def test_subscription_repository_update_found() -> None:
    repo = SubscriptionRepository()
    result = repo.update_subscription(SEED_ID, {"status": "paused"})
    assert result is not None
    assert result.status == "paused"


def test_subscription_repository_update_not_found() -> None:
    repo = SubscriptionRepository()
    assert repo.update_subscription("unknown", {"status": "X"}) is None


def test_subscription_repository_delete_found() -> None:
    repo = SubscriptionRepository()
    assert repo.delete_subscription(SEED_ID) is True


def test_subscription_repository_delete_not_found() -> None:
    repo = SubscriptionRepository()
    assert repo.delete_subscription("unknown") is False


def test_subscription_service_list() -> None:
    service = SubscriptionService(SubscriptionRepository())
    items = service.list_subscriptions()
    assert len(items) == 1
    assert isinstance(items[0], SubscriptionDto)
    assert items[0].interval == "month"


def test_subscription_service_get_found() -> None:
    service = SubscriptionService(SubscriptionRepository())
    item = service.get_subscription(SEED_ID)
    assert item.id == SEED_ID


def test_subscription_service_get_not_found() -> None:
    service = SubscriptionService(SubscriptionRepository())
    with pytest.raises(HTTPException) as err:
        service.get_subscription("unknown")
    assert err.value.status_code == 404


def test_subscription_service_create() -> None:
    service = SubscriptionService(SubscriptionRepository())
    dto = CreateSubscriptionDto(customer_id="cid", product_slug="site-pro", interval="month", amount_cents=19900)
    result = service.create_subscription(dto)
    assert isinstance(result, SubscriptionDto)


def test_subscription_service_update_found() -> None:
    service = SubscriptionService(SubscriptionRepository())
    result = service.update_subscription(SEED_ID, UpdateSubscriptionDto(status="paused"))
    assert result.status == "paused"


def test_subscription_service_update_not_found() -> None:
    service = SubscriptionService(SubscriptionRepository())
    with pytest.raises(HTTPException) as err:
        service.update_subscription("unknown", UpdateSubscriptionDto(status="X"))
    assert err.value.status_code == 404


def test_subscription_service_delete_not_found() -> None:
    service = SubscriptionService(SubscriptionRepository())
    with pytest.raises(HTTPException) as err:
        service.delete_subscription("unknown")
    assert err.value.status_code == 404


def test_subscription_controller_list() -> None:
    controller = SubscriptionController()
    items = controller.list_subscriptions()
    assert len(items) == 1
    assert items[0].product_slug == "site-pro"


def test_subscription_controller_get() -> None:
    controller = SubscriptionController()
    item = controller.get_subscription(SEED_ID)
    assert item.interval == "month"


def test_subscription_controller_create() -> None:
    controller = SubscriptionController()
    dto = CreateSubscriptionDto(customer_id="cid", product_slug="site-pro", interval="month", amount_cents=19900)
    result = controller.create_subscription(dto)
    assert isinstance(result, SubscriptionDto)


def test_subscription_controller_delete() -> None:
    controller = SubscriptionController()
    controller.delete_subscription(SEED_ID)  # Should not raise


def test_subscription_route_list(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/subscriptions", headers=auth_headers)
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["id"] == SEED_ID


def test_subscription_route_list_unauthenticated(client: TestClient) -> None:
    response = client.get("/api/v1/subscriptions")
    assert response.status_code == 403


def test_subscription_route_create(client: TestClient, auth_headers: dict) -> None:
    payload = {"customer_id": "cid", "product_slug": "site-pro", "interval": "month", "amount_cents": 19900}
    response = client.post("/api/v1/subscriptions", json=payload, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["product_slug"] == "site-pro"


def test_subscription_route_get_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/subscriptions/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 200


def test_subscription_route_get_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/subscriptions/unknown", headers=auth_headers)
    assert response.status_code == 404


def test_subscription_route_update_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch(f"/api/v1/subscriptions/{SEED_ID}", json={"status": "paused"}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["status"] == "paused"


def test_subscription_route_update_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch("/api/v1/subscriptions/unknown", json={"status": "X"}, headers=auth_headers)
    assert response.status_code == 404


def test_subscription_route_delete_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete(f"/api/v1/subscriptions/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 204


def test_subscription_route_delete_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete("/api/v1/subscriptions/unknown", headers=auth_headers)
    assert response.status_code == 404
