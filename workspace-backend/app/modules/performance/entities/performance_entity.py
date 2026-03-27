from dataclasses import dataclass


@dataclass
class SellerMetricEntity:
    id: str
    user_id: str
    date: str
    messages_sent: int
    messages_received: int
    conversations_opened: int
    conversations_resolved: int
    avg_response_time_minutes: float | None


@dataclass
class CoachingEntity:
    id: str
    user_id: str
    coaching_type: str
    content_text: str
    created_at: str


@dataclass
class ReminderEntity:
    id: str
    user_id: str
    reminder_type: str
    status: str
    scheduled_at: str
    content_preview: str | None
