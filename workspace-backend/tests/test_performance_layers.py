from fastapi.testclient import TestClient

from app.modules.performance.controllers.performance_controller import PerformanceController
from app.modules.performance.dtos.performance_dto import CoachingDto, ReminderDto, SellerMetricDto
from app.modules.performance.entities.performance_entity import (
    CoachingEntity,
    ReminderEntity,
    SellerMetricEntity,
)
from app.modules.performance.repositories.performance_repository import PerformanceRepository
from app.modules.performance.services.performance_service import PerformanceService


def test_performance_repository_list_metrics() -> None:
    repository = PerformanceRepository()
    items = repository.list_metrics()
    assert len(items) == 1
    assert isinstance(items[0], SellerMetricEntity)
    assert items[0].messages_sent == 142


def test_performance_repository_list_coaching() -> None:
    repository = PerformanceRepository()
    items = repository.list_coaching()
    assert len(items) == 1
    assert isinstance(items[0], CoachingEntity)
    assert items[0].coaching_type == "sales_coaching"


def test_performance_repository_list_reminders() -> None:
    repository = PerformanceRepository()
    items = repository.list_reminders()
    assert len(items) == 1
    assert isinstance(items[0], ReminderEntity)
    assert items[0].status == "pending"


def test_performance_service_list_metrics() -> None:
    service = PerformanceService(PerformanceRepository())
    items = service.list_metrics()
    assert len(items) == 1
    assert isinstance(items[0], SellerMetricDto)
    assert items[0].conversations_resolved == 19


def test_performance_service_list_coaching() -> None:
    service = PerformanceService(PerformanceRepository())
    items = service.list_coaching()
    assert len(items) == 1
    assert isinstance(items[0], CoachingDto)


def test_performance_service_list_reminders() -> None:
    service = PerformanceService(PerformanceRepository())
    items = service.list_reminders()
    assert len(items) == 1
    assert isinstance(items[0], ReminderDto)
    assert items[0].reminder_type == "follow_up"


def test_performance_controller_list_metrics() -> None:
    controller = PerformanceController()
    items = controller.list_metrics()
    assert len(items) == 1
    assert items[0].avg_response_time_minutes == 4.5


def test_performance_controller_list_coaching() -> None:
    controller = PerformanceController()
    items = controller.list_coaching()
    assert len(items) == 1


def test_performance_controller_list_reminders() -> None:
    controller = PerformanceController()
    items = controller.list_reminders()
    assert len(items) == 1


def test_performance_route_metrics(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/performance/metrics", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_performance_route_coaching(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/performance/coaching", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_performance_route_reminders(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/performance/reminders", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_performance_route_unauthenticated(client: TestClient) -> None:
    response = client.get("/api/v1/performance/metrics")
    assert response.status_code == 403
