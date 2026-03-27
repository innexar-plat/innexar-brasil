from typing import List
from uuid import UUID

from app.modules.analytics.dtos.analytics_event_response_dto import AnalyticsEventResponseDto
from app.modules.analytics.dtos.create_analytics_event_dto import CreateAnalyticsEventDto
from app.modules.analytics.services.analytics_service import AnalyticsService


class AnalyticsController:
    def __init__(self, service: AnalyticsService) -> None:
        self.service = service

    def create_event(self, dto: CreateAnalyticsEventDto) -> AnalyticsEventResponseDto:
        return self.service.create_event(dto)

    def list_events(self) -> List[AnalyticsEventResponseDto]:
        return self.service.list_events()

    def get_event(self, event_id: UUID) -> AnalyticsEventResponseDto:
        return self.service.get_event(event_id)
