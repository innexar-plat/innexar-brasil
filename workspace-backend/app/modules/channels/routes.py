from fastapi import APIRouter, Depends, status

from app.core.auth_dependency import get_current_user
from app.modules.channels.controllers.channel_controller import ChannelController
from app.modules.channels.dtos.channel_dto import (
    ChannelAccountDto,
    CreateChannelDto,
    SyncJobDto,
    SyncStatusDto,
    UpdateChannelDto,
)

router = APIRouter(prefix="/channels", tags=["channels"])
controller = ChannelController()


@router.get("", response_model=list[ChannelAccountDto], status_code=status.HTTP_200_OK)
def list_accounts(_: str = Depends(get_current_user)) -> list[ChannelAccountDto]:
    return controller.list_accounts()


@router.post("", response_model=ChannelAccountDto, status_code=status.HTTP_201_CREATED)
def create_account(dto: CreateChannelDto, _: str = Depends(get_current_user)) -> ChannelAccountDto:
    return controller.create_account(dto)


@router.get("/{account_id}", response_model=ChannelAccountDto, status_code=status.HTTP_200_OK)
def get_account(account_id: str, _: str = Depends(get_current_user)) -> ChannelAccountDto:
    return controller.get_account(account_id)


@router.patch("/{account_id}", response_model=ChannelAccountDto, status_code=status.HTTP_200_OK)
def update_account(account_id: str, dto: UpdateChannelDto, _: str = Depends(get_current_user)) -> ChannelAccountDto:
    return controller.update_account(account_id, dto)


@router.delete("/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(account_id: str, _: str = Depends(get_current_user)) -> None:
    return controller.delete_account(account_id)


@router.get("/{account_id}/sync-status", response_model=SyncStatusDto, status_code=status.HTTP_200_OK)
def get_sync_status(account_id: str, _: str = Depends(get_current_user)) -> SyncStatusDto:
    return controller.get_sync_status(account_id)


@router.get("/{account_id}/sync-jobs", response_model=list[SyncJobDto], status_code=status.HTTP_200_OK)
def list_sync_jobs(account_id: str, _: str = Depends(get_current_user)) -> list[SyncJobDto]:
    return controller.list_sync_jobs(account_id)

