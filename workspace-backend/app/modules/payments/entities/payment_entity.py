from dataclasses import dataclass


@dataclass
class PaymentEntity:
    id: str
    invoice_id: str
    provider: str
    amount_cents: int
    status: str
