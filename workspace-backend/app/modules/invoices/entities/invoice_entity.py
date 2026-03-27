from dataclasses import dataclass


@dataclass
class InvoiceEntity:
    id: str
    subscription_id: str
    amount_cents: int
    currency: str
    status: str
