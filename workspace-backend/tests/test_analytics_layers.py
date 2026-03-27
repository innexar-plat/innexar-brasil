from uuid import UUID, uuid4

import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.modules.analytics.controllers.analytics_controller import AnalyticsController
from app.modules.analytics.dtos.analytics_event_response_dto import AnalyticsEventResponseDto
from app.modules.analytics.dtos.create_analytics_event_dto import CreateAnalyticsEventDto
from app.modules.analytics.entities.analytics_event_entity import AnalyticsEventEntity
from app.modules.analytics.repositories.analytics_repository import AnalyticsRepository
from app.modules.analytics.services.analytics_service import AnalyticsService


def test_analytics_repository_create_and_list() -> None:
    repository = AnalyticsRepository()
    created = repository.create(
        AnalyticsEventEntity(event_name="checkout_started", source="web")
    )

    listed = repository.list_all()

    assert created.id is not None
    assert len(listed) == 1
    assert listed[0].event_name == "checkout_started"


def test_analytics_repository_get_not_found() -> None:
    repository = AnalyticsRepository()

    item = repository.get_by_id(uuid4())

    assert item is None


def test_analytics_service_create_and_get() -> None:
    service = AnalyticsService(AnalyticsRepository())
    created = service.create_event(
        CreateAnalyticsEventDto(event_name="payment_confirmed", source="gateway")
    )

    fetched = service.get_event(created.id)

    assert isinstance(created, AnalyticsEventResponseDto)
    assert isinstance(fetched.id, UUID)
    assert fetched.source == "gateway"


def test_analytics_service_get_not_found() -> None:
    service = AnalyticsService(AnalyticsRepository())

    with pytest.raises(HTTPException) as err:
        service.get_event(uuid4())

    assert err.value.status_code == 404


def test_analytics_controller_list() -> None:
    controller = AnalyticsController(AnalyticsService(AnalyticsRepository()))
    controller.create_event(
        CreateAnalyticsEventDto(event_name="lead_created", source="crm")
    )

    items = controller.list_events()

    assert len(items) == 1
    assert items[0].source == "crm"


def test_analytics_route_create(client: TestClient, auth_headers: dict) -> None:
    response = client.post(
        "/api/v1/analytics/events",
        json={"event_name": "checkout_started", "source": "web"},
        headers=auth_headers,
    )

    assert response.status_code == 201
    assert response.json()["event_name"] == "checkout_started"


def test_analytics_route_list(client: TestClient, auth_headers: dict) -> None:
    client.post(
        "/api/v1/analytics/events",
        json={"event_name": "invoice_viewed", "source": "web"},
        headers=auth_headers,
    )

    response = client.get("/api/v1/analytics/events", headers=auth_headers)

    assert response.status_code == 200
    assert len(response.json()) >= 1


def test_analytics_route_get_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/analytics/events/{uuid4()}", headers=auth_headers)

    assert response.status_code == 404
    assert response.json()["detail"] == "Analytics event not found"


def test_analytics_route_unauthenticated(client: TestClient) -> None:
    response = client.get("/api/v1/analytics/events")
    assert response.status_code == 403
