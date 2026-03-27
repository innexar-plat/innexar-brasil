from dataclasses import dataclass


@dataclass
class AssistantSessionEntity:
    id: str
    user_id: str
    title: str | None
    created_at: str
    updated_at: str


@dataclass
class AssistantMessageEntity:
    id: str
    session_id: str
    role: str
    content: str
    created_at: str
