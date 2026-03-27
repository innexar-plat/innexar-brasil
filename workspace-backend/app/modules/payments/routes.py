from fastapi import APIRouter, Depends, status

from app.core.auth_dependency import get_current_user
from app.modules.payments.controllers.payment_controller import PaymentController
from app.modules.payments.dtos.payment_dto import CreatePaymentDto, PaymentDto

router = APIRouter(prefix="/payments", tags=["payments"])
controller = PaymentController()


@router.get("", response_model=list[PaymentDto], status_code=status.HTTP_200_OK)
def list_payments(_: str = Depends(get_current_user)) -> list[PaymentDto]:
    return controller.list_payments()


@router.post("", response_model=PaymentDto, status_code=status.HTTP_201_CREATED)
def create_payment(dto: CreatePaymentDto, _: str = Depends(get_current_user)) -> PaymentDto:
    return controller.create_payment(dto)


@router.get("/{payment_id}", response_model=PaymentDto, status_code=status.HTTP_200_OK)
def get_payment(payment_id: str, _: str = Depends(get_current_user)) -> PaymentDto:
    return controller.get_payment(payment_id)

