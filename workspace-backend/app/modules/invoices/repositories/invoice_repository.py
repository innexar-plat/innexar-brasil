from dataclasses import replace as dc_replace

from app.modules.invoices.entities.invoice_entity import InvoiceEntity

_SEED: dict[str, InvoiceEntity] = {
    "50000000-0000-0000-0000-000000000001": InvoiceEntity(
        id="50000000-0000-0000-0000-000000000001",
        subscription_id="30000000-0000-0000-0000-000000000001",
        amount_cents=19900,
        currency="BRL",
        status="pending",
    )
}


class InvoiceRepository:
    def list_invoices(self) -> list[InvoiceEntity]:
        return list(_SEED.values())

    def get_invoice(self, invoice_id: str) -> InvoiceEntity | None:
        return _SEED.get(invoice_id)

    def create_invoice(self, entity: InvoiceEntity) -> InvoiceEntity:
        return entity

    def update_invoice(
        self, invoice_id: str, updates: dict[str, object]
    ) -> InvoiceEntity | None:
        existing = _SEED.get(invoice_id)
        if existing is None:
            return None
        return dc_replace(existing, **updates)

