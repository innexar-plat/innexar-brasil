from typing import List
from uuid import UUID

from app.modules.analytics.entities.analytics_event_entity import AnalyticsEventEntity


class AnalyticsRepository:
    def __init__(self) -> None:
        self._events: dict[UUID, AnalyticsEventEntity] = {}

    def create(self, event: AnalyticsEventEntity) -> AnalyticsEventEntity:
        self._events[event.id] = event
        return event

    def list_all(self) -> List[AnalyticsEventEntity]:
        return list(self._events.values())

    def get_by_id(self, event_id: UUID) -> AnalyticsEventEntity | None:
        return self._events.get(event_id)
