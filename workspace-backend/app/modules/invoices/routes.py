from fastapi import APIRouter, Depends, status

from app.core.auth_dependency import get_current_user
from app.modules.invoices.controllers.invoice_controller import InvoiceController
from app.modules.invoices.dtos.invoice_dto import CreateInvoiceDto, InvoiceDto, UpdateInvoiceDto

router = APIRouter(prefix="/invoices", tags=["invoices"])
controller = InvoiceController()


@router.get("", response_model=list[InvoiceDto], status_code=status.HTTP_200_OK)
def list_invoices(_: str = Depends(get_current_user)) -> list[InvoiceDto]:
    return controller.list_invoices()


@router.post("", response_model=InvoiceDto, status_code=status.HTTP_201_CREATED)
def create_invoice(dto: CreateInvoiceDto, _: str = Depends(get_current_user)) -> InvoiceDto:
    return controller.create_invoice(dto)


@router.get("/{invoice_id}", response_model=InvoiceDto, status_code=status.HTTP_200_OK)
def get_invoice(invoice_id: str, _: str = Depends(get_current_user)) -> InvoiceDto:
    return controller.get_invoice(invoice_id)


@router.patch("/{invoice_id}", response_model=InvoiceDto, status_code=status.HTTP_200_OK)
def update_invoice(invoice_id: str, dto: UpdateInvoiceDto, _: str = Depends(get_current_user)) -> InvoiceDto:
    return controller.update_invoice(invoice_id, dto)

