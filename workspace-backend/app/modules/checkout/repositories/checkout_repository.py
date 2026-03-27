from app.modules.checkout.entities.checkout_entity import CheckoutEntity


class CheckoutRepository:
    def create_checkout(self, customer_email: str, product_slug: str, amount_cents: int) -> CheckoutEntity:
        # Stub repository to bootstrap service contract.
        return CheckoutEntity(
            id="40000000-0000-0000-0000-000000000001",
            customer_id=f"customer::{customer_email}",
            product_slug=product_slug,
            amount_cents=amount_cents,
            status="pending",
            payment_provider="mercadopago",
        )

    def get_checkout(self, checkout_id: str) -> CheckoutEntity | None:
        if checkout_id != "40000000-0000-0000-0000-000000000001":
            return None

        return CheckoutEntity(
            id=checkout_id,
            customer_id="customer::client1@innexar.com",
            product_slug="site-pro",
            amount_cents=19900,
            status="pending",
            payment_provider="mercadopago",
        )
