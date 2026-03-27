from dataclasses import dataclass


@dataclass
class CheckoutEntity:
    id: str
    customer_id: str
    product_slug: str
    amount_cents: int
    status: str
    payment_provider: str
