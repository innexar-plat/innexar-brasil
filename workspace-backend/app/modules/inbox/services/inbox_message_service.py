import uuid

from app.core.errors import not_found
from app.modules.inbox.dtos.inbox_message_dto import CreateInboxMessageDto, InboxMessageDto, UpdateInboxMessageDto
from app.modules.inbox.entities.inbox_message_entity import InboxMessageEntity
from app.modules.inbox.repositories.inbox_message_repository import InboxMessageRepository


class InboxMessageService:
    def __init__(self, repository: InboxMessageRepository) -> None:
        self.repository = repository

    def _to_dto(self, item: InboxMessageEntity) -> InboxMessageDto:
        return InboxMessageDto(
            id=item.id,
            contact_id=item.contact_id,
            channel=item.channel,
            content=item.content,
            status=item.status,
        )

    def list_messages(self) -> list[InboxMessageDto]:
        return [self._to_dto(item) for item in self.repository.list_messages()]

    def get_message(self, message_id: str) -> InboxMessageDto:
        message = self.repository.get_message(message_id)
        if message is None:
            raise not_found("Message not found")
        return self._to_dto(message)

    def create_message(self, dto: CreateInboxMessageDto) -> InboxMessageDto:
        entity = InboxMessageEntity(
            id=str(uuid.uuid4()),
            contact_id=dto.contact_id,
            channel=dto.channel,
            content=dto.content,
            status=dto.status,
        )
        return self._to_dto(self.repository.create_message(entity))

    def update_message(self, message_id: str, dto: UpdateInboxMessageDto) -> InboxMessageDto:
        updates = {k: v for k, v in dto.model_dump().items() if v is not None}
        entity = self.repository.update_message(message_id, updates)
        if entity is None:
            raise not_found("Message not found")
        return self._to_dto(entity)

