from fastapi import APIRouter, Depends, status

from app.core.auth_dependency import get_current_user
from app.modules.tickets.controllers.ticket_controller import TicketController
from app.modules.tickets.dtos.ticket_dto import CreateTicketDto, TicketDto, UpdateTicketDto

router = APIRouter(prefix="/tickets", tags=["tickets"])
controller = TicketController()


@router.get("", response_model=list[TicketDto], status_code=status.HTTP_200_OK)
def list_tickets(_: str = Depends(get_current_user)) -> list[TicketDto]:
    return controller.list_tickets()


@router.post("", response_model=TicketDto, status_code=status.HTTP_201_CREATED)
def create_ticket(dto: CreateTicketDto, _: str = Depends(get_current_user)) -> TicketDto:
    return controller.create_ticket(dto)


@router.get("/{ticket_id}", response_model=TicketDto, status_code=status.HTTP_200_OK)
def get_ticket(ticket_id: str, _: str = Depends(get_current_user)) -> TicketDto:
    return controller.get_ticket(ticket_id)


@router.patch("/{ticket_id}", response_model=TicketDto, status_code=status.HTTP_200_OK)
def update_ticket(ticket_id: str, dto: UpdateTicketDto, _: str = Depends(get_current_user)) -> TicketDto:
    return controller.update_ticket(ticket_id, dto)

