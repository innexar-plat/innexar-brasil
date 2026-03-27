from fastapi import APIRouter, Depends, status

from app.core.auth_dependency import get_current_user
from app.modules.assistant.controllers.assistant_controller import AssistantController
from app.modules.assistant.dtos.assistant_dto import (
    AssistantMessageDto,
    AssistantSessionDto,
    CreateAssistantMessageDto,
    CreateAssistantSessionDto,
)

router = APIRouter(prefix="/assistant", tags=["assistant"])
controller = AssistantController()


@router.get("/sessions", response_model=list[AssistantSessionDto], status_code=status.HTTP_200_OK)
def list_sessions(_: str = Depends(get_current_user)) -> list[AssistantSessionDto]:
    return controller.list_sessions()


@router.post("/sessions", response_model=AssistantSessionDto, status_code=status.HTTP_201_CREATED)
def create_session(dto: CreateAssistantSessionDto, _: str = Depends(get_current_user)) -> AssistantSessionDto:
    return controller.create_session(dto)


@router.get("/sessions/{session_id}", response_model=AssistantSessionDto, status_code=status.HTTP_200_OK)
def get_session(session_id: str, _: str = Depends(get_current_user)) -> AssistantSessionDto:
    return controller.get_session(session_id)


@router.delete("/sessions/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_session(session_id: str, _: str = Depends(get_current_user)) -> None:
    return controller.delete_session(session_id)


@router.get("/sessions/{session_id}/messages", response_model=list[AssistantMessageDto], status_code=status.HTTP_200_OK)
def list_messages(session_id: str, _: str = Depends(get_current_user)) -> list[AssistantMessageDto]:
    return controller.list_messages(session_id)


@router.post("/sessions/{session_id}/messages", response_model=AssistantMessageDto, status_code=status.HTTP_201_CREATED)
def create_message(session_id: str, dto: CreateAssistantMessageDto, _: str = Depends(get_current_user)) -> AssistantMessageDto:
    return controller.create_message(session_id, dto)

