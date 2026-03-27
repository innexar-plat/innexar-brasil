from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class CreateAnalyticsEventDto(BaseModel):
    event_name: str = Field(min_length=2, max_length=120)
    source: str = Field(min_length=2, max_length=80)
    customer_id: Optional[UUID] = None
    occurred_at: Optional[datetime] = None
