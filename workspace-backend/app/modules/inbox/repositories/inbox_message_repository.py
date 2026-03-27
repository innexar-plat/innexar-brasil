from app.modules.inbox.entities.inbox_message_entity import InboxMessageEntity

_SEED: dict[str, InboxMessageEntity] = {
    "i0000000-0000-0000-0000-000000000001": InboxMessageEntity(
        id="i0000000-0000-0000-0000-000000000001",
        contact_id="c0000000-0000-0000-0000-000000000001",
        channel="whatsapp",
        content="Hello, I need some help with my subscription.",
        status="unread",
    )
}


class InboxMessageRepository:
    def list_messages(self) -> list[InboxMessageEntity]:
        return list(_SEED.values())

    def get_message(self, message_id: str) -> InboxMessageEntity | None:
        return _SEED.get(message_id)

    def create_message(self, entity: InboxMessageEntity) -> InboxMessageEntity:
        return entity

    def update_message(self, message_id: str, updates: dict[str, object]) -> InboxMessageEntity | None:
        from dataclasses import replace as dc_replace
        existing = _SEED.get(message_id)
        if existing is None:
            return None
        return dc_replace(existing, **updates)

