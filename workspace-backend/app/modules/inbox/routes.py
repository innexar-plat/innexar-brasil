from fastapi import APIRouter, Depends, status

from app.core.auth_dependency import get_current_user
from app.modules.inbox.controllers.inbox_message_controller import InboxMessageController
from app.modules.inbox.dtos.inbox_message_dto import CreateInboxMessageDto, InboxMessageDto, UpdateInboxMessageDto

router = APIRouter(prefix="/inbox", tags=["inbox"])
controller = InboxMessageController()


@router.get("", response_model=list[InboxMessageDto], status_code=status.HTTP_200_OK)
def list_messages(_: str = Depends(get_current_user)) -> list[InboxMessageDto]:
    return controller.list_messages()


@router.post("", response_model=InboxMessageDto, status_code=status.HTTP_201_CREATED)
def create_message(dto: CreateInboxMessageDto, _: str = Depends(get_current_user)) -> InboxMessageDto:
    return controller.create_message(dto)


@router.get("/{message_id}", response_model=InboxMessageDto, status_code=status.HTTP_200_OK)
def get_message(message_id: str, _: str = Depends(get_current_user)) -> InboxMessageDto:
    return controller.get_message(message_id)


@router.patch("/{message_id}", response_model=InboxMessageDto, status_code=status.HTTP_200_OK)
def update_message(message_id: str, dto: UpdateInboxMessageDto, _: str = Depends(get_current_user)) -> InboxMessageDto:
    return controller.update_message(message_id, dto)

