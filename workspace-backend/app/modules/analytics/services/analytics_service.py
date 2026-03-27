from typing import List
from uuid import UUID

from app.core.errors import not_found
from app.modules.analytics.dtos.analytics_event_response_dto import AnalyticsEventResponseDto
from app.modules.analytics.dtos.create_analytics_event_dto import CreateAnalyticsEventDto
from app.modules.analytics.entities.analytics_event_entity import AnalyticsEventEntity
from app.modules.analytics.repositories.analytics_repository import AnalyticsRepository


class AnalyticsService:
    def __init__(self, repository: AnalyticsRepository) -> None:
        self.repository = repository

    def create_event(self, dto: CreateAnalyticsEventDto) -> AnalyticsEventResponseDto:
        event = AnalyticsEventEntity(
            event_name=dto.event_name,
            source=dto.source,
            customer_id=dto.customer_id,
            occurred_at=dto.occurred_at,
        )
        created = self.repository.create(event)
        return self._to_response(created)

    def list_events(self) -> List[AnalyticsEventResponseDto]:
        return [self._to_response(event) for event in self.repository.list_all()]

    def get_event(self, event_id: UUID) -> AnalyticsEventResponseDto:
        event = self.repository.get_by_id(event_id)
        if event is None:
            raise not_found("Analytics event not found")
        return self._to_response(event)

    @staticmethod
    def _to_response(event: AnalyticsEventEntity) -> AnalyticsEventResponseDto:
        return AnalyticsEventResponseDto(
            id=event.id,
            event_name=event.event_name,
            source=event.source,
            customer_id=event.customer_id,
            occurred_at=event.occurred_at,
        )
