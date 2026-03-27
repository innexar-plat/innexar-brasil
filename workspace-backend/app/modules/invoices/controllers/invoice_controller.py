from app.modules.invoices.dtos.invoice_dto import CreateInvoiceDto, InvoiceDto, UpdateInvoiceDto
from app.modules.invoices.repositories.invoice_repository import InvoiceRepository
from app.modules.invoices.services.invoice_service import InvoiceService


class InvoiceController:
    def __init__(self) -> None:
        repository = InvoiceRepository()
        self.service = InvoiceService(repository)

    def list_invoices(self) -> list[InvoiceDto]:
        return self.service.list_invoices()

    def get_invoice(self, invoice_id: str) -> InvoiceDto:
        return self.service.get_invoice(invoice_id)

    def create_invoice(self, dto: CreateInvoiceDto) -> InvoiceDto:
        return self.service.create_invoice(dto)

    def update_invoice(self, invoice_id: str, dto: UpdateInvoiceDto) -> InvoiceDto:
        return self.service.update_invoice(invoice_id, dto)
