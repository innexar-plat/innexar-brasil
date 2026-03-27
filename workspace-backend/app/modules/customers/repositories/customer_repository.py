from dataclasses import replace as dc_replace

from app.modules.customers.entities.customer_entity import CustomerEntity

_SEED: dict[str, CustomerEntity] = {
    "10000000-0000-0000-0000-000000000001": CustomerEntity(
        id="10000000-0000-0000-0000-000000000001",
        email="client1@innexar.com",
        first_name="Client",
        last_name="One",
        status="active",
    )
}


class CustomerRepository:
    def list_customers(self) -> list[CustomerEntity]:
        return list(_SEED.values())

    def get_customer(self, customer_id: str) -> CustomerEntity | None:
        return _SEED.get(customer_id)

    def create_customer(self, entity: CustomerEntity) -> CustomerEntity:
        return entity

    def update_customer(
        self, customer_id: str, updates: dict[str, object]
    ) -> CustomerEntity | None:
        existing = _SEED.get(customer_id)
        if existing is None:
            return None
        return dc_replace(existing, **updates)

