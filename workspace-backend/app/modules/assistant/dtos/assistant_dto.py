from pydantic import BaseModel, Field


class AssistantSessionDto(BaseModel):
    id: str
    user_id: str
    title: str | None = None
    created_at: str
    updated_at: str


class CreateAssistantSessionDto(BaseModel):
    user_id: str
    title: str | None = None


class AssistantMessageDto(BaseModel):
    id: str
    session_id: str
    role: str = Field(min_length=1, max_length=20)
    content: str = Field(min_length=1, max_length=32000)
    created_at: str


class CreateAssistantMessageDto(BaseModel):
    role: str = Field(default="user", min_length=1, max_length=20)
    content: str = Field(min_length=1, max_length=32000)

