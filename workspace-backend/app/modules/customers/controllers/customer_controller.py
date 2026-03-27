from app.modules.customers.dtos.customer_dto import CreateCustomerDto, CustomerDto, UpdateCustomerDto
from app.modules.customers.repositories.customer_repository import CustomerRepository
from app.modules.customers.services.customer_service import CustomerService


class CustomerController:
    def __init__(self) -> None:
        repository = CustomerRepository()
        self.service = CustomerService(repository)

    def list_customers(self) -> list[CustomerDto]:
        return self.service.list_customers()

    def get_customer(self, customer_id: str) -> CustomerDto:
        return self.service.get_customer(customer_id)

    def create_customer(self, dto: CreateCustomerDto) -> CustomerDto:
        return self.service.create_customer(dto)

    def update_customer(self, customer_id: str, dto: UpdateCustomerDto) -> CustomerDto:
        return self.service.update_customer(customer_id, dto)

