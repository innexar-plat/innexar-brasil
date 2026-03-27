import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.modules.tickets.controllers.ticket_controller import TicketController
from app.modules.tickets.dtos.ticket_dto import CreateTicketDto, TicketDto, UpdateTicketDto
from app.modules.tickets.entities.ticket_entity import TicketEntity
from app.modules.tickets.repositories.ticket_repository import TicketRepository
from app.modules.tickets.services.ticket_service import TicketService

SEED_ID = "60000000-0000-0000-0000-000000000001"


def test_ticket_repository_list() -> None:
    repo = TicketRepository()
    items = repo.list_tickets()
    assert len(items) == 1
    assert isinstance(items[0], TicketEntity)
    assert items[0].status == "open"


def test_ticket_repository_get_found() -> None:
    repo = TicketRepository()
    item = repo.get_ticket(SEED_ID)
    assert item is not None
    assert item.priority == "medium"


def test_ticket_repository_get_not_found() -> None:
    repo = TicketRepository()
    assert repo.get_ticket("unknown") is None


def test_ticket_repository_create() -> None:
    repo = TicketRepository()
    entity = TicketEntity(id="new-id", customer_id="cid", title="New Ticket", priority="low", status="open")
    result = repo.create_ticket(entity)
    assert result.id == "new-id"


def test_ticket_repository_update_found() -> None:
    repo = TicketRepository()
    result = repo.update_ticket(SEED_ID, {"status": "resolved"})
    assert result is not None
    assert result.status == "resolved"


def test_ticket_repository_update_not_found() -> None:
    repo = TicketRepository()
    assert repo.update_ticket("unknown", {"status": "X"}) is None


def test_ticket_service_list() -> None:
    service = TicketService(TicketRepository())
    items = service.list_tickets()
    assert len(items) == 1
    assert isinstance(items[0], TicketDto)
    assert items[0].title == "Need onboarding support"


def test_ticket_service_get_found() -> None:
    service = TicketService(TicketRepository())
    item = service.get_ticket(SEED_ID)
    assert item.id == SEED_ID


def test_ticket_service_get_not_found() -> None:
    service = TicketService(TicketRepository())
    with pytest.raises(HTTPException) as err:
        service.get_ticket("unknown")
    assert err.value.status_code == 404


def test_ticket_service_create() -> None:
    service = TicketService(TicketRepository())
    dto = CreateTicketDto(customer_id="cid", title="New Ticket")
    result = service.create_ticket(dto)
    assert isinstance(result, TicketDto)


def test_ticket_service_update_found() -> None:
    service = TicketService(TicketRepository())
    result = service.update_ticket(SEED_ID, UpdateTicketDto(status="resolved"))
    assert result.status == "resolved"


def test_ticket_service_update_not_found() -> None:
    service = TicketService(TicketRepository())
    with pytest.raises(HTTPException) as err:
        service.update_ticket("unknown", UpdateTicketDto(status="X"))
    assert err.value.status_code == 404


def test_ticket_controller_list() -> None:
    controller = TicketController()
    items = controller.list_tickets()
    assert len(items) == 1
    assert items[0].title == "Need onboarding support"


def test_ticket_controller_get() -> None:
    controller = TicketController()
    item = controller.get_ticket(SEED_ID)
    assert item.priority == "medium"


def test_ticket_controller_create() -> None:
    controller = TicketController()
    dto = CreateTicketDto(customer_id="cid", title="New Ticket")
    result = controller.create_ticket(dto)
    assert isinstance(result, TicketDto)


def test_ticket_route_list(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/tickets", headers=auth_headers)
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_ticket_route_list_unauthenticated(client: TestClient) -> None:
    response = client.get("/api/v1/tickets")
    assert response.status_code == 403


def test_ticket_route_create(client: TestClient, auth_headers: dict) -> None:
    payload = {"customer_id": "cid", "title": "New Ticket", "priority": "low"}
    response = client.post("/api/v1/tickets", json=payload, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["title"] == "New Ticket"


def test_ticket_route_get_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/tickets/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 200


def test_ticket_route_get_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/tickets/unknown", headers=auth_headers)
    assert response.status_code == 404


def test_ticket_route_update_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch(f"/api/v1/tickets/{SEED_ID}", json={"status": "resolved"}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["status"] == "resolved"


def test_ticket_route_update_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch("/api/v1/tickets/unknown", json={"status": "X"}, headers=auth_headers)
    assert response.status_code == 404
