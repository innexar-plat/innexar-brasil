from app.modules.inbox.dtos.inbox_message_dto import CreateInboxMessageDto, InboxMessageDto, UpdateInboxMessageDto
from app.modules.inbox.repositories.inbox_message_repository import InboxMessageRepository
from app.modules.inbox.services.inbox_message_service import InboxMessageService


class InboxMessageController:
    def __init__(self) -> None:
        repository = InboxMessageRepository()
        self.service = InboxMessageService(repository)

    def list_messages(self) -> list[InboxMessageDto]:
        return self.service.list_messages()

    def get_message(self, message_id: str) -> InboxMessageDto:
        return self.service.get_message(message_id)

    def create_message(self, dto: CreateInboxMessageDto) -> InboxMessageDto:
        return self.service.create_message(dto)

    def update_message(self, message_id: str, dto: UpdateInboxMessageDto) -> InboxMessageDto:
        return self.service.update_message(message_id, dto)

