import uuid

from app.core.errors import not_found
from app.modules.customers.dtos.customer_dto import CreateCustomerDto, CustomerDto, UpdateCustomerDto
from app.modules.customers.entities.customer_entity import CustomerEntity
from app.modules.customers.repositories.customer_repository import CustomerRepository


class CustomerService:
    def __init__(self, repository: CustomerRepository) -> None:
        self.repository = repository

    def _to_dto(self, item: CustomerEntity) -> CustomerDto:
        return CustomerDto(
            id=item.id,
            email=item.email,
            first_name=item.first_name,
            last_name=item.last_name,
            status=item.status,
        )

    def list_customers(self) -> list[CustomerDto]:
        return [self._to_dto(item) for item in self.repository.list_customers()]

    def get_customer(self, customer_id: str) -> CustomerDto:
        entity = self.repository.get_customer(customer_id)
        if entity is None:
            raise not_found("Customer not found")
        return self._to_dto(entity)

    def create_customer(self, dto: CreateCustomerDto) -> CustomerDto:
        entity = CustomerEntity(
            id=str(uuid.uuid4()),
            email=dto.email,
            first_name=dto.first_name,
            last_name=dto.last_name,
            status=dto.status,
        )
        return self._to_dto(self.repository.create_customer(entity))

    def update_customer(self, customer_id: str, dto: UpdateCustomerDto) -> CustomerDto:
        updates = {k: v for k, v in dto.model_dump().items() if v is not None}
        entity = self.repository.update_customer(customer_id, updates)
        if entity is None:
            raise not_found("Customer not found")
        return self._to_dto(entity)

