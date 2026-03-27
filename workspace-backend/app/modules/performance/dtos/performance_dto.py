from pydantic import BaseModel, Field


class SellerMetricDto(BaseModel):
    id: str
    user_id: str
    date: str
    messages_sent: int
    messages_received: int
    conversations_opened: int
    conversations_resolved: int
    avg_response_time_minutes: float | None = None


class CoachingDto(BaseModel):
    id: str
    user_id: str
    coaching_type: str = Field(min_length=1, max_length=100)
    content_text: str = Field(min_length=1, max_length=4000)
    created_at: str


class ReminderDto(BaseModel):
    id: str
    user_id: str
    reminder_type: str = Field(min_length=1, max_length=100)
    status: str = Field(min_length=1, max_length=30)
    scheduled_at: str
    content_preview: str | None = None
