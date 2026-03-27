from app.modules.performance.dtos.performance_dto import (
    CoachingDto,
    ReminderDto,
    SellerMetricDto,
)
from app.modules.performance.repositories.performance_repository import PerformanceRepository
from app.modules.performance.services.performance_service import PerformanceService


class PerformanceController:
    def __init__(self) -> None:
        self.service = PerformanceService(PerformanceRepository())

    def list_metrics(self) -> list[SellerMetricDto]:
        return self.service.list_metrics()

    def list_coaching(self) -> list[CoachingDto]:
        return self.service.list_coaching()

    def list_reminders(self) -> list[ReminderDto]:
        return self.service.list_reminders()
