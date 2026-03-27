import uuid
from datetime import UTC, datetime

from app.core.errors import not_found
from app.modules.assistant.dtos.assistant_dto import (
    AssistantMessageDto,
    AssistantSessionDto,
    CreateAssistantMessageDto,
    CreateAssistantSessionDto,
)
from app.modules.assistant.entities.assistant_entity import (
    AssistantMessageEntity,
    AssistantSessionEntity,
)
from app.modules.assistant.repositories.assistant_repository import AssistantRepository


class AssistantService:
    def __init__(self, repository: AssistantRepository) -> None:
        self.repository = repository

    def list_sessions(self) -> list[AssistantSessionDto]:
        return [
            AssistantSessionDto(
                id=item.id,
                user_id=item.user_id,
                title=item.title,
                created_at=item.created_at,
                updated_at=item.updated_at,
            )
            for item in self.repository.list_sessions()
        ]

    def get_session(self, session_id: str) -> AssistantSessionDto:
        session = self.repository.get_session(session_id)
        if session is None:
            raise not_found("Assistant session not found")
        return AssistantSessionDto(
            id=session.id,
            user_id=session.user_id,
            title=session.title,
            created_at=session.created_at,
            updated_at=session.updated_at,
        )

    def create_session(self, dto: CreateAssistantSessionDto) -> AssistantSessionDto:
        now = datetime.now(UTC).isoformat()
        entity = AssistantSessionEntity(
            id=str(uuid.uuid4()),
            user_id=dto.user_id,
            title=dto.title,
            created_at=now,
            updated_at=now,
        )
        created = self.repository.create_session(entity)
        return AssistantSessionDto(
            id=created.id,
            user_id=created.user_id,
            title=created.title,
            created_at=created.created_at,
            updated_at=created.updated_at,
        )

    def delete_session(self, session_id: str) -> None:
        if not self.repository.delete_session(session_id):
            raise not_found("Assistant session not found")

    def list_messages(self, session_id: str) -> list[AssistantMessageDto]:
        return [
            AssistantMessageDto(
                id=item.id,
                session_id=item.session_id,
                role=item.role,
                content=item.content,
                created_at=item.created_at,
            )
            for item in self.repository.list_messages(session_id)
        ]

    def create_message(self, session_id: str, dto: CreateAssistantMessageDto) -> AssistantMessageDto:
        session = self.repository.get_session(session_id)
        if session is None:
            raise not_found("Assistant session not found")
        entity = AssistantMessageEntity(
            id=str(uuid.uuid4()),
            session_id=session_id,
            role=dto.role,
            content=dto.content,
            created_at=datetime.now(UTC).isoformat(),
        )
        created = self.repository.create_message(entity)
        return AssistantMessageDto(
            id=created.id,
            session_id=created.session_id,
            role=created.role,
            content=created.content,
            created_at=created.created_at,
        )

