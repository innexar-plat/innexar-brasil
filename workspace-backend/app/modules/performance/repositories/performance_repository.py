from app.modules.performance.entities.performance_entity import (
    CoachingEntity,
    ReminderEntity,
    SellerMetricEntity,
)


class PerformanceRepository:
    def list_metrics(self) -> list[SellerMetricEntity]:
        return [
            SellerMetricEntity(
                id="pm000000-0000-0000-0000-000000000001",
                user_id="u0000000-0000-0000-0000-000000000001",
                date="2026-03-01",
                messages_sent=142,
                messages_received=98,
                conversations_opened=23,
                conversations_resolved=19,
                avg_response_time_minutes=4.5,
            )
        ]

    def list_coaching(self) -> list[CoachingEntity]:
        return [
            CoachingEntity(
                id="pc000000-0000-0000-0000-000000000001",
                user_id="u0000000-0000-0000-0000-000000000001",
                coaching_type="sales_coaching",
                content_text="Follow up faster — average response time is above 5 minutes.",
                created_at="2026-03-01T10:00:00Z",
            )
        ]

    def list_reminders(self) -> list[ReminderEntity]:
        return [
            ReminderEntity(
                id="pr000000-0000-0000-0000-000000000001",
                user_id="u0000000-0000-0000-0000-000000000001",
                reminder_type="follow_up",
                status="pending",
                scheduled_at="2026-03-28T09:00:00Z",
                content_preview="Follow up with lead: Maria Silva",
            )
        ]
