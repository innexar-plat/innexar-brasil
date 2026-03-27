import uuid

from app.core.errors import not_found
from app.modules.payments.dtos.payment_dto import CreatePaymentDto, PaymentDto
from app.modules.payments.entities.payment_entity import PaymentEntity
from app.modules.payments.repositories.payment_repository import PaymentRepository


class PaymentService:
    def __init__(self, repository: PaymentRepository) -> None:
        self.repository = repository

    def _to_dto(self, item: PaymentEntity) -> PaymentDto:
        return PaymentDto(
            id=item.id,
            invoice_id=item.invoice_id,
            provider=item.provider,
            amount_cents=item.amount_cents,
            status=item.status,
        )

    def list_payments(self) -> list[PaymentDto]:
        return [self._to_dto(item) for item in self.repository.list_payments()]

    def get_payment(self, payment_id: str) -> PaymentDto:
        payment = self.repository.get_payment(payment_id)
        if payment is None:
            raise not_found("Payment not found")
        return self._to_dto(payment)

    def create_payment(self, dto: CreatePaymentDto) -> PaymentDto:
        entity = PaymentEntity(
            id=str(uuid.uuid4()),
            invoice_id=dto.invoice_id,
            provider=dto.provider,
            amount_cents=dto.amount_cents,
            status=dto.status,
        )
        return self._to_dto(self.repository.create_payment(entity))

