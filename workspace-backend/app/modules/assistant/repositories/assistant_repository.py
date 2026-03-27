from app.modules.assistant.entities.assistant_entity import (
    AssistantMessageEntity,
    AssistantSessionEntity,
)

_SESSION_SEED: dict[str, AssistantSessionEntity] = {
    "as000000-0000-0000-0000-000000000001": AssistantSessionEntity(
        id="as000000-0000-0000-0000-000000000001",
        user_id="u0000000-0000-0000-0000-000000000001",
        title="Sales funnel analysis",
        created_at="2026-03-27T08:00:00Z",
        updated_at="2026-03-27T09:00:00Z",
    )
}


class AssistantRepository:
    def list_sessions(self) -> list[AssistantSessionEntity]:
        return list(_SESSION_SEED.values())

    def get_session(self, session_id: str) -> AssistantSessionEntity | None:
        return _SESSION_SEED.get(session_id)

    def create_session(self, entity: AssistantSessionEntity) -> AssistantSessionEntity:
        return entity

    def delete_session(self, session_id: str) -> bool:
        return session_id in _SESSION_SEED

    def list_messages(self, session_id: str) -> list[AssistantMessageEntity]:
        if session_id not in _SESSION_SEED:
            return []
        return [
            AssistantMessageEntity(
                id="am000000-0000-0000-0000-000000000001",
                session_id=session_id,
                role="user",
                content="Show me the current funnel performance.",
                created_at="2026-03-27T08:01:00Z",
            ),
            AssistantMessageEntity(
                id="am000000-0000-0000-0000-000000000002",
                session_id=session_id,
                role="assistant",
                content="Sure! Your funnel shows 23 leads this week with a 19% conversion rate.",
                created_at="2026-03-27T08:01:05Z",
            ),
        ]

    def create_message(self, entity: AssistantMessageEntity) -> AssistantMessageEntity:
        return entity

