from app.modules.assistant.dtos.assistant_dto import (
    AssistantMessageDto,
    AssistantSessionDto,
    CreateAssistantMessageDto,
    CreateAssistantSessionDto,
)
from app.modules.assistant.repositories.assistant_repository import AssistantRepository
from app.modules.assistant.services.assistant_service import AssistantService


class AssistantController:
    def __init__(self) -> None:
        self.service = AssistantService(AssistantRepository())

    def list_sessions(self) -> list[AssistantSessionDto]:
        return self.service.list_sessions()

    def get_session(self, session_id: str) -> AssistantSessionDto:
        return self.service.get_session(session_id)

    def create_session(self, dto: CreateAssistantSessionDto) -> AssistantSessionDto:
        return self.service.create_session(dto)

    def delete_session(self, session_id: str) -> None:
        return self.service.delete_session(session_id)

    def list_messages(self, session_id: str) -> list[AssistantMessageDto]:
        return self.service.list_messages(session_id)

    def create_message(self, session_id: str, dto: CreateAssistantMessageDto) -> AssistantMessageDto:
        return self.service.create_message(session_id, dto)

