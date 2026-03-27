import uuid

from app.core.errors import not_found
from app.modules.invoices.dtos.invoice_dto import CreateInvoiceDto, InvoiceDto, UpdateInvoiceDto
from app.modules.invoices.entities.invoice_entity import InvoiceEntity
from app.modules.invoices.repositories.invoice_repository import InvoiceRepository


class InvoiceService:
    def __init__(self, repository: InvoiceRepository) -> None:
        self.repository = repository

    def _to_dto(self, item: InvoiceEntity) -> InvoiceDto:
        return InvoiceDto(
            id=item.id,
            subscription_id=item.subscription_id,
            amount_cents=item.amount_cents,
            currency=item.currency,
            status=item.status,
        )

    def list_invoices(self) -> list[InvoiceDto]:
        return [self._to_dto(item) for item in self.repository.list_invoices()]

    def get_invoice(self, invoice_id: str) -> InvoiceDto:
        invoice = self.repository.get_invoice(invoice_id)
        if invoice is None:
            raise not_found("Invoice not found")
        return self._to_dto(invoice)

    def create_invoice(self, dto: CreateInvoiceDto) -> InvoiceDto:
        entity = InvoiceEntity(
            id=str(uuid.uuid4()),
            subscription_id=dto.subscription_id,
            amount_cents=dto.amount_cents,
            currency=dto.currency,
            status=dto.status,
        )
        return self._to_dto(self.repository.create_invoice(entity))

    def update_invoice(self, invoice_id: str, dto: UpdateInvoiceDto) -> InvoiceDto:
        updates = {k: v for k, v in dto.model_dump().items() if v is not None}
        entity = self.repository.update_invoice(invoice_id, updates)
        if entity is None:
            raise not_found("Invoice not found")
        return self._to_dto(entity)

