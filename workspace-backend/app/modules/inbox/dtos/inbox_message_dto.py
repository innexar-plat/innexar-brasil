from pydantic import BaseModel, Field


class InboxMessageDto(BaseModel):
    id: str
    contact_id: str
    channel: str = Field(min_length=1, max_length=50)
    content: str = Field(min_length=1, max_length=4000)
    status: str = Field(min_length=1, max_length=30)


class CreateInboxMessageDto(BaseModel):
    contact_id: str
    channel: str = Field(min_length=1, max_length=50)
    content: str = Field(min_length=1, max_length=4000)
    status: str = Field(default="unread", min_length=1, max_length=30)


class UpdateInboxMessageDto(BaseModel):
    status: str | None = Field(default=None, min_length=1, max_length=30)

