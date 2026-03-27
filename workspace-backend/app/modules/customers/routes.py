from fastapi import APIRouter, Depends, status

from app.core.auth_dependency import get_current_user
from app.modules.customers.controllers.customer_controller import CustomerController
from app.modules.customers.dtos.customer_dto import CreateCustomerDto, CustomerDto, UpdateCustomerDto

router = APIRouter(prefix="/customers", tags=["customers"])
controller = CustomerController()


@router.get("", response_model=list[CustomerDto], status_code=status.HTTP_200_OK)
def list_customers(_: str = Depends(get_current_user)) -> list[CustomerDto]:
    return controller.list_customers()


@router.post("", response_model=CustomerDto, status_code=status.HTTP_201_CREATED)
def create_customer(
    payload: CreateCustomerDto, _: str = Depends(get_current_user)
) -> CustomerDto:
    return controller.create_customer(payload)


@router.get("/{customer_id}", response_model=CustomerDto, status_code=status.HTTP_200_OK)
def get_customer(
    customer_id: str, _: str = Depends(get_current_user)
) -> CustomerDto:
    return controller.get_customer(customer_id)


@router.patch("/{customer_id}", response_model=CustomerDto, status_code=status.HTTP_200_OK)
def update_customer(
    customer_id: str,
    payload: UpdateCustomerDto,
    _: str = Depends(get_current_user),
) -> CustomerDto:
    return controller.update_customer(customer_id, payload)

