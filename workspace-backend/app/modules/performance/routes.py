from fastapi import APIRouter, Depends, status

from app.core.auth_dependency import get_current_user
from app.modules.performance.controllers.performance_controller import PerformanceController
from app.modules.performance.dtos.performance_dto import (
    CoachingDto,
    ReminderDto,
    SellerMetricDto,
)

router = APIRouter(prefix="/performance", tags=["performance"])
controller = PerformanceController()


@router.get("/metrics", response_model=list[SellerMetricDto], status_code=status.HTTP_200_OK)
def list_metrics(_: str = Depends(get_current_user)) -> list[SellerMetricDto]:
    return controller.list_metrics()


@router.get("/coaching", response_model=list[CoachingDto], status_code=status.HTTP_200_OK)
def list_coaching(_: str = Depends(get_current_user)) -> list[CoachingDto]:
    return controller.list_coaching()


@router.get("/reminders", response_model=list[ReminderDto], status_code=status.HTTP_200_OK)
def list_reminders(_: str = Depends(get_current_user)) -> list[ReminderDto]:
    return controller.list_reminders()

