from app.modules.channels.dtos.channel_dto import (
    ChannelAccountDto,
    CreateChannelDto,
    SyncJobDto,
    SyncStatusDto,
    UpdateChannelDto,
)
from app.modules.channels.repositories.channel_repository import ChannelRepository
from app.modules.channels.services.channel_service import ChannelService


class ChannelController:
    def __init__(self) -> None:
        self.service = ChannelService(ChannelRepository())

    def list_accounts(self) -> list[ChannelAccountDto]:
        return self.service.list_accounts()

    def get_account(self, account_id: str) -> ChannelAccountDto:
        return self.service.get_account(account_id)

    def create_account(self, dto: CreateChannelDto) -> ChannelAccountDto:
        return self.service.create_account(dto)

    def update_account(self, account_id: str, dto: UpdateChannelDto) -> ChannelAccountDto:
        return self.service.update_account(account_id, dto)

    def delete_account(self, account_id: str) -> None:
        return self.service.delete_account(account_id)

    def get_sync_status(self, account_id: str) -> SyncStatusDto:
        return self.service.get_sync_status(account_id)

    def list_sync_jobs(self, account_id: str) -> list[SyncJobDto]:
        return self.service.list_sync_jobs(account_id)

