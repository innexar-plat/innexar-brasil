from app.modules.performance.dtos.performance_dto import (
    CoachingDto,
    ReminderDto,
    SellerMetricDto,
)
from app.modules.performance.repositories.performance_repository import PerformanceRepository


class PerformanceService:
    def __init__(self, repository: PerformanceRepository) -> None:
        self.repository = repository

    def list_metrics(self) -> list[SellerMetricDto]:
        return [
            SellerMetricDto(
                id=item.id,
                user_id=item.user_id,
                date=item.date,
                messages_sent=item.messages_sent,
                messages_received=item.messages_received,
                conversations_opened=item.conversations_opened,
                conversations_resolved=item.conversations_resolved,
                avg_response_time_minutes=item.avg_response_time_minutes,
            )
            for item in self.repository.list_metrics()
        ]

    def list_coaching(self) -> list[CoachingDto]:
        return [
            CoachingDto(
                id=item.id,
                user_id=item.user_id,
                coaching_type=item.coaching_type,
                content_text=item.content_text,
                created_at=item.created_at,
            )
            for item in self.repository.list_coaching()
        ]

    def list_reminders(self) -> list[ReminderDto]:
        return [
            ReminderDto(
                id=item.id,
                user_id=item.user_id,
                reminder_type=item.reminder_type,
                status=item.status,
                scheduled_at=item.scheduled_at,
                content_preview=item.content_preview,
            )
            for item in self.repository.list_reminders()
        ]
