import uuid
from datetime import UTC, datetime

from app.core.errors import not_found
from app.modules.channels.dtos.channel_dto import (
    ChannelAccountDto,
    CreateChannelDto,
    SyncJobDto,
    SyncStatusDto,
    UpdateChannelDto,
)
from app.modules.channels.entities.channel_entity import ChannelAccountEntity
from app.modules.channels.repositories.channel_repository import ChannelRepository


class ChannelService:
    def __init__(self, repository: ChannelRepository) -> None:
        self.repository = repository

    def _to_dto(self, item: ChannelAccountEntity) -> ChannelAccountDto:
        return ChannelAccountDto(
            id=item.id,
            provider=item.provider,
            instance_name=item.instance_name,
            phone_number=item.phone_number,
            status=item.status,
            active=item.active,
            is_ai_instance=item.is_ai_instance,
            agent_mode=item.agent_mode,
            created_at=item.created_at,
        )

    def list_accounts(self) -> list[ChannelAccountDto]:
        return [self._to_dto(item) for item in self.repository.list_accounts()]

    def get_account(self, account_id: str) -> ChannelAccountDto:
        account = self.repository.get_account(account_id)
        if account is None:
            raise not_found("Channel account not found")
        return self._to_dto(account)

    def create_account(self, dto: CreateChannelDto) -> ChannelAccountDto:
        entity = ChannelAccountEntity(
            id=str(uuid.uuid4()),
            provider=dto.provider,
            instance_name=dto.instance_name,
            phone_number=dto.phone_number,
            status="pending",
            active=False,
            is_ai_instance=dto.is_ai_instance,
            agent_mode=dto.agent_mode,
            created_at=datetime.now(UTC).isoformat(),
        )
        return self._to_dto(self.repository.create_account(entity))

    def update_account(self, account_id: str, dto: UpdateChannelDto) -> ChannelAccountDto:
        updates = {k: v for k, v in dto.model_dump().items() if v is not None}
        entity = self.repository.update_account(account_id, updates)
        if entity is None:
            raise not_found("Channel account not found")
        return self._to_dto(entity)

    def delete_account(self, account_id: str) -> None:
        if not self.repository.delete_account(account_id):
            raise not_found("Channel account not found")

    def get_sync_status(self, account_id: str) -> SyncStatusDto:
        sync = self.repository.get_sync_status(account_id)
        if sync is None:
            raise not_found("Sync status not found")
        return SyncStatusDto(
            account_id=sync.account_id,
            sync_health=sync.sync_health,
            latest_job_status=sync.latest_job_status,
            last_completed_at=sync.last_completed_at,
            conversations_indexed=sync.conversations_indexed,
            messages_synced=sync.messages_synced,
            messages_live=sync.messages_live,
            pending_jobs=sync.pending_jobs,
        )

    def list_sync_jobs(self, account_id: str) -> list[SyncJobDto]:
        return [
            SyncJobDto(
                id=item.id,
                account_id=item.account_id,
                job_type=item.job_type,
                status=item.status,
                started_at=item.started_at,
                ended_at=item.ended_at,
                error_detail=item.error_detail,
                created_at=item.created_at,
            )
            for item in self.repository.list_sync_jobs(account_id)
        ]

