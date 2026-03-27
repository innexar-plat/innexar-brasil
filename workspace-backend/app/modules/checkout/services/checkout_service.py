from app.core.errors import not_found
from app.modules.checkout.dtos.checkout_dto import CheckoutDto, StartCheckoutRequestDto
from app.modules.checkout.repositories.checkout_repository import CheckoutRepository


class CheckoutService:
    def __init__(self, repository: CheckoutRepository) -> None:
        self.repository = repository

    def start_checkout(self, dto: StartCheckoutRequestDto) -> CheckoutDto:
        checkout = self.repository.create_checkout(
            customer_email=dto.customer_email,
            product_slug=dto.product_slug,
            amount_cents=dto.amount_cents,
        )

        return CheckoutDto(
            id=checkout.id,
            customer_id=checkout.customer_id,
            product_slug=checkout.product_slug,
            amount_cents=checkout.amount_cents,
            status=checkout.status,
            payment_provider=checkout.payment_provider,
        )

    def get_checkout(self, checkout_id: str) -> CheckoutDto:
        checkout = self.repository.get_checkout(checkout_id)
        if checkout is None:
            raise not_found("Checkout not found")

        return CheckoutDto(
            id=checkout.id,
            customer_id=checkout.customer_id,
            product_slug=checkout.product_slug,
            amount_cents=checkout.amount_cents,
            status=checkout.status,
            payment_provider=checkout.payment_provider,
        )
