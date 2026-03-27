from dataclasses import replace as dc_replace

from app.modules.tickets.entities.ticket_entity import TicketEntity

_SEED: dict[str, TicketEntity] = {
    "60000000-0000-0000-0000-000000000001": TicketEntity(
        id="60000000-0000-0000-0000-000000000001",
        customer_id="10000000-0000-0000-0000-000000000001",
        title="Need onboarding support",
        priority="medium",
        status="open",
    )
}


class TicketRepository:
    def list_tickets(self) -> list[TicketEntity]:
        return list(_SEED.values())

    def get_ticket(self, ticket_id: str) -> TicketEntity | None:
        return _SEED.get(ticket_id)

    def create_ticket(self, entity: TicketEntity) -> TicketEntity:
        return entity

    def update_ticket(
        self, ticket_id: str, updates: dict[str, object]
    ) -> TicketEntity | None:
        existing = _SEED.get(ticket_id)
        if existing is None:
            return None
        return dc_replace(existing, **updates)

