from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, status

from app.core.auth_dependency import get_current_user
from app.modules.analytics.controllers.analytics_controller import AnalyticsController
from app.modules.analytics.dtos.analytics_event_response_dto import AnalyticsEventResponseDto
from app.modules.analytics.dtos.create_analytics_event_dto import CreateAnalyticsEventDto
from app.modules.analytics.repositories.analytics_repository import AnalyticsRepository
from app.modules.analytics.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/analytics", tags=["Analytics"])

analytics_repository = AnalyticsRepository()
analytics_service = AnalyticsService(analytics_repository)
analytics_controller = AnalyticsController(analytics_service)


@router.post("/events", response_model=AnalyticsEventResponseDto, status_code=status.HTTP_201_CREATED)
def create_analytics_event(payload: CreateAnalyticsEventDto, _: str = Depends(get_current_user)) -> AnalyticsEventResponseDto:
    return analytics_controller.create_event(payload)


@router.get("/events", response_model=List[AnalyticsEventResponseDto], status_code=status.HTTP_200_OK)
def list_analytics_events(_: str = Depends(get_current_user)) -> List[AnalyticsEventResponseDto]:
    return analytics_controller.list_events()


@router.get("/events/{event_id}", response_model=AnalyticsEventResponseDto, status_code=status.HTTP_200_OK)
def get_analytics_event(event_id: UUID, _: str = Depends(get_current_user)) -> AnalyticsEventResponseDto:
    return analytics_controller.get_event(event_id)

