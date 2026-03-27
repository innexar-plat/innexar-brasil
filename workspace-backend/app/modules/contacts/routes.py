from fastapi import APIRouter, Depends, status

from app.core.auth_dependency import get_current_user
from app.modules.contacts.controllers.contact_controller import ContactController
from app.modules.contacts.dtos.contact_dto import ContactDto, CreateContactDto, UpdateContactDto

router = APIRouter(prefix="/contacts", tags=["contacts"])
controller = ContactController()


@router.get("", response_model=list[ContactDto], status_code=status.HTTP_200_OK)
def list_contacts(_: str = Depends(get_current_user)) -> list[ContactDto]:
    return controller.list_contacts()


@router.post("", response_model=ContactDto, status_code=status.HTTP_201_CREATED)
def create_contact(payload: CreateContactDto, _: str = Depends(get_current_user)) -> ContactDto:
    return controller.create_contact(payload)


@router.get("/{contact_id}", response_model=ContactDto, status_code=status.HTTP_200_OK)
def get_contact(contact_id: str, _: str = Depends(get_current_user)) -> ContactDto:
    return controller.get_contact(contact_id)


@router.patch("/{contact_id}", response_model=ContactDto, status_code=status.HTTP_200_OK)
def update_contact(
    contact_id: str, payload: UpdateContactDto, _: str = Depends(get_current_user)
) -> ContactDto:
    return controller.update_contact(contact_id, payload)


@router.delete("/{contact_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact(contact_id: str, _: str = Depends(get_current_user)) -> None:
    controller.delete_contact(contact_id)

