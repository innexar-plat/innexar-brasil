from datetime import UTC, datetime
from typing import Optional
from uuid import UUID, uuid4


class AnalyticsEventEntity:
    def __init__(
        self,
        event_name: str,
        source: str,
        customer_id: Optional[UUID] = None,
        occurred_at: Optional[datetime] = None,
        event_id: Optional[UUID] = None,
    ) -> None:
        self.id: UUID = event_id or uuid4()
        self.event_name = event_name
        self.source = source
        self.customer_id = customer_id
        self.occurred_at = occurred_at or datetime.now(UTC)
