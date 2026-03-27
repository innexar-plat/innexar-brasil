from fastapi import APIRouter, status

from app.modules.checkout.controllers.checkout_controller import CheckoutController
from app.modules.checkout.dtos.checkout_dto import CheckoutDto, StartCheckoutRequestDto, StartCheckoutResponseDto

router = APIRouter(prefix="/checkout", tags=["checkout"])
controller = CheckoutController()


@router.post("/start", response_model=StartCheckoutResponseDto, status_code=status.HTTP_201_CREATED)
def start_checkout(payload: StartCheckoutRequestDto) -> StartCheckoutResponseDto:
    result = controller.start_checkout(payload)
    return StartCheckoutResponseDto(data=result)


@router.get("/{checkout_id}", response_model=CheckoutDto, status_code=status.HTTP_200_OK)
def get_checkout(checkout_id: str) -> CheckoutDto:
    return controller.get_checkout(checkout_id)
