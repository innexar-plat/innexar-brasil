from app.modules.subscriptions.dtos.subscription_dto import (
    CreateSubscriptionDto,
    SubscriptionDto,
    UpdateSubscriptionDto,
)
from app.modules.subscriptions.repositories.subscription_repository import SubscriptionRepository
from app.modules.subscriptions.services.subscription_service import SubscriptionService


class SubscriptionController:
    def __init__(self) -> None:
        repository = SubscriptionRepository()
        self.service = SubscriptionService(repository)

    def list_subscriptions(self) -> list[SubscriptionDto]:
        return self.service.list_subscriptions()

    def get_subscription(self, subscription_id: str) -> SubscriptionDto:
        return self.service.get_subscription(subscription_id)

    def create_subscription(self, dto: CreateSubscriptionDto) -> SubscriptionDto:
        return self.service.create_subscription(dto)

    def update_subscription(self, subscription_id: str, dto: UpdateSubscriptionDto) -> SubscriptionDto:
        return self.service.update_subscription(subscription_id, dto)

    def delete_subscription(self, subscription_id: str) -> None:
        return self.service.delete_subscription(subscription_id)

