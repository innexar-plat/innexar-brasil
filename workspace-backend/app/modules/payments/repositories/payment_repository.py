
from app.modules.payments.entities.payment_entity import PaymentEntity

_SEED: dict[str, PaymentEntity] = {
    "80000000-0000-0000-0000-000000000001": PaymentEntity(
        id="80000000-0000-0000-0000-000000000001",
        invoice_id="50000000-0000-0000-0000-000000000001",
        provider="mercadopago",
        amount_cents=19900,
        status="pending",
    )
}


class PaymentRepository:
    def list_payments(self) -> list[PaymentEntity]:
        return list(_SEED.values())

    def get_payment(self, payment_id: str) -> PaymentEntity | None:
        return _SEED.get(payment_id)

    def create_payment(self, entity: PaymentEntity) -> PaymentEntity:
        return entity

