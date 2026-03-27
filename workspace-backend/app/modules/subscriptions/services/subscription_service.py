import uuid

from app.core.errors import not_found
from app.modules.subscriptions.dtos.subscription_dto import (
    CreateSubscriptionDto,
    SubscriptionDto,
    UpdateSubscriptionDto,
)
from app.modules.subscriptions.entities.subscription_entity import SubscriptionEntity
from app.modules.subscriptions.repositories.subscription_repository import SubscriptionRepository


class SubscriptionService:
    def __init__(self, repository: SubscriptionRepository) -> None:
        self.repository = repository

    def _to_dto(self, item: SubscriptionEntity) -> SubscriptionDto:
        return SubscriptionDto(
            id=item.id,
            customer_id=item.customer_id,
            product_slug=item.product_slug,
            status=item.status,
            interval=item.interval,
            amount_cents=item.amount_cents,
        )

    def list_subscriptions(self) -> list[SubscriptionDto]:
        return [self._to_dto(item) for item in self.repository.list_subscriptions()]

    def get_subscription(self, subscription_id: str) -> SubscriptionDto:
        entity = self.repository.get_subscription(subscription_id)
        if entity is None:
            raise not_found("Subscription not found")
        return self._to_dto(entity)

    def create_subscription(self, dto: CreateSubscriptionDto) -> SubscriptionDto:
        entity = SubscriptionEntity(
            id=str(uuid.uuid4()),
            customer_id=dto.customer_id,
            product_slug=dto.product_slug,
            status=dto.status,
            interval=dto.interval,
            amount_cents=dto.amount_cents,
        )
        return self._to_dto(self.repository.create_subscription(entity))

    def update_subscription(self, subscription_id: str, dto: UpdateSubscriptionDto) -> SubscriptionDto:
        updates = {k: v for k, v in dto.model_dump().items() if v is not None}
        entity = self.repository.update_subscription(subscription_id, updates)
        if entity is None:
            raise not_found("Subscription not found")
        return self._to_dto(entity)

    def delete_subscription(self, subscription_id: str) -> None:
        if not self.repository.delete_subscription(subscription_id):
            raise not_found("Subscription not found")

