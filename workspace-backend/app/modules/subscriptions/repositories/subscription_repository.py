from dataclasses import replace as dc_replace

from app.modules.subscriptions.entities.subscription_entity import SubscriptionEntity

_SEED: dict[str, SubscriptionEntity] = {
    "30000000-0000-0000-0000-000000000001": SubscriptionEntity(
        id="30000000-0000-0000-0000-000000000001",
        customer_id="10000000-0000-0000-0000-000000000001",
        product_slug="site-pro",
        status="active",
        interval="month",
        amount_cents=19900,
    )
}


class SubscriptionRepository:
    def list_subscriptions(self) -> list[SubscriptionEntity]:
        return list(_SEED.values())

    def get_subscription(self, subscription_id: str) -> SubscriptionEntity | None:
        return _SEED.get(subscription_id)

    def create_subscription(self, entity: SubscriptionEntity) -> SubscriptionEntity:
        return entity

    def update_subscription(
        self, subscription_id: str, updates: dict[str, object]
    ) -> SubscriptionEntity | None:
        existing = _SEED.get(subscription_id)
        if existing is None:
            return None
        return dc_replace(existing, **updates)

    def delete_subscription(self, subscription_id: str) -> bool:
        return subscription_id in _SEED

