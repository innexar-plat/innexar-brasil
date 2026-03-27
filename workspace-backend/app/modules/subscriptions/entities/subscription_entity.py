from dataclasses import dataclass


@dataclass
class SubscriptionEntity:
    id: str
    customer_id: str
    product_slug: str
    status: str
    interval: str
    amount_cents: int
