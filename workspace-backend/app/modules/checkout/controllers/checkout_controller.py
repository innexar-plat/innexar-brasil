from app.modules.checkout.dtos.checkout_dto import CheckoutDto, StartCheckoutRequestDto
from app.modules.checkout.repositories.checkout_repository import CheckoutRepository
from app.modules.checkout.services.checkout_service import CheckoutService


class CheckoutController:
    def __init__(self) -> None:
        repository = CheckoutRepository()
        self.service = CheckoutService(repository)

    def start_checkout(self, request: StartCheckoutRequestDto) -> CheckoutDto:
        return self.service.start_checkout(request)

    def get_checkout(self, checkout_id: str) -> CheckoutDto:
        return self.service.get_checkout(checkout_id)
