import uuid

from app.core.errors import not_found
from app.modules.tickets.dtos.ticket_dto import CreateTicketDto, TicketDto, UpdateTicketDto
from app.modules.tickets.entities.ticket_entity import TicketEntity
from app.modules.tickets.repositories.ticket_repository import TicketRepository


class TicketService:
    def __init__(self, repository: TicketRepository) -> None:
        self.repository = repository

    def _to_dto(self, item: TicketEntity) -> TicketDto:
        return TicketDto(
            id=item.id,
            customer_id=item.customer_id,
            title=item.title,
            priority=item.priority,
            status=item.status,
        )

    def list_tickets(self) -> list[TicketDto]:
        return [self._to_dto(item) for item in self.repository.list_tickets()]

    def get_ticket(self, ticket_id: str) -> TicketDto:
        ticket = self.repository.get_ticket(ticket_id)
        if ticket is None:
            raise not_found("Ticket not found")
        return self._to_dto(ticket)

    def create_ticket(self, dto: CreateTicketDto) -> TicketDto:
        entity = TicketEntity(
            id=str(uuid.uuid4()),
            customer_id=dto.customer_id,
            title=dto.title,
            priority=dto.priority,
            status=dto.status,
        )
        return self._to_dto(self.repository.create_ticket(entity))

    def update_ticket(self, ticket_id: str, dto: UpdateTicketDto) -> TicketDto:
        updates = {k: v for k, v in dto.model_dump().items() if v is not None}
        entity = self.repository.update_ticket(ticket_id, updates)
        if entity is None:
            raise not_found("Ticket not found")
        return self._to_dto(entity)

