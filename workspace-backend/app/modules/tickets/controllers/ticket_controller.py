from app.modules.tickets.dtos.ticket_dto import CreateTicketDto, TicketDto, UpdateTicketDto
from app.modules.tickets.repositories.ticket_repository import TicketRepository
from app.modules.tickets.services.ticket_service import TicketService


class TicketController:
    def __init__(self) -> None:
        repository = TicketRepository()
        self.service = TicketService(repository)

    def list_tickets(self) -> list[TicketDto]:
        return self.service.list_tickets()

    def get_ticket(self, ticket_id: str) -> TicketDto:
        return self.service.get_ticket(ticket_id)

    def create_ticket(self, dto: CreateTicketDto) -> TicketDto:
        return self.service.create_ticket(dto)

    def update_ticket(self, ticket_id: str, dto: UpdateTicketDto) -> TicketDto:
        return self.service.update_ticket(ticket_id, dto)
