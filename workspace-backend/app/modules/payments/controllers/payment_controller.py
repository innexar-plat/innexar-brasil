from app.modules.payments.dtos.payment_dto import CreatePaymentDto, PaymentDto
from app.modules.payments.repositories.payment_repository import PaymentRepository
from app.modules.payments.services.payment_service import PaymentService


class PaymentController:
    def __init__(self) -> None:
        repository = PaymentRepository()
        self.service = PaymentService(repository)

    def list_payments(self) -> list[PaymentDto]:
        return self.service.list_payments()

    def get_payment(self, payment_id: str) -> PaymentDto:
        return self.service.get_payment(payment_id)

    def create_payment(self, dto: CreatePaymentDto) -> PaymentDto:
        return self.service.create_payment(dto)
