from pydantic import BaseModel, Field


class TicketDto(BaseModel):
    id: str
    customer_id: str
    title: str = Field(min_length=1, max_length=255)
    priority: str = Field(min_length=1, max_length=20)
    status: str = Field(min_length=1, max_length=30)

class CreateTicketDto(BaseModel):
    customer_id: str
    title: str = Field(min_length=1, max_length=255)
    priority: str = Field(default="medium", min_length=1, max_length=30)
    status: str = Field(default="open", min_length=1, max_length=30)


class UpdateTicketDto(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    priority: str | None = Field(default=None, min_length=1, max_length=30)
    status: str | None = Field(default=None, min_length=1, max_length=30)
