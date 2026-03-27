from fastapi import APIRouter, Depends, status

from app.core.auth_dependency import get_current_user
from app.modules.subscriptions.controllers.subscription_controller import SubscriptionController
from app.modules.subscriptions.dtos.subscription_dto import (
    CreateSubscriptionDto,
    SubscriptionDto,
    UpdateSubscriptionDto,
)

router = APIRouter(prefix="/subscriptions", tags=["subscriptions"])
controller = SubscriptionController()


@router.get("", response_model=list[SubscriptionDto], status_code=status.HTTP_200_OK)
def list_subscriptions(_: str = Depends(get_current_user)) -> list[SubscriptionDto]:
    return controller.list_subscriptions()


@router.post("", response_model=SubscriptionDto, status_code=status.HTTP_201_CREATED)
def create_subscription(
    payload: CreateSubscriptionDto, _: str = Depends(get_current_user)
) -> SubscriptionDto:
    return controller.create_subscription(payload)


@router.get("/{subscription_id}", response_model=SubscriptionDto, status_code=status.HTTP_200_OK)
def get_subscription(
    subscription_id: str, _: str = Depends(get_current_user)
) -> SubscriptionDto:
    return controller.get_subscription(subscription_id)


@router.patch(
    "/{subscription_id}", response_model=SubscriptionDto, status_code=status.HTTP_200_OK
)
def update_subscription(
    subscription_id: str,
    payload: UpdateSubscriptionDto,
    _: str = Depends(get_current_user),
) -> SubscriptionDto:
    return controller.update_subscription(subscription_id, payload)


@router.delete("/{subscription_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subscription(
    subscription_id: str, _: str = Depends(get_current_user)
) -> None:
    controller.delete_subscription(subscription_id)

