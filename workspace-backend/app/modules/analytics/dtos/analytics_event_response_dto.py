from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class AnalyticsEventResponseDto(BaseModel):
    id: UUID
    event_name: str
    source: str
    customer_id: Optional[UUID] = None
    occurred_at: datetime
