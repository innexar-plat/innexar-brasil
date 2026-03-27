from dataclasses import replace as dc_replace

from app.modules.channels.entities.channel_entity import (
    ChannelAccountEntity,
    SyncJobEntity,
    SyncStatusEntity,
)

_SEED: dict[str, ChannelAccountEntity] = {
    "ch000000-0000-0000-0000-000000000001": ChannelAccountEntity(
        id="ch000000-0000-0000-0000-000000000001",
        provider="evolution",
        instance_name="innexar-main",
        phone_number="+55 11 99999-0001",
        status="connected",
        active=True,
        is_ai_instance=False,
        agent_mode="manual",
        created_at="2026-01-01T00:00:00Z",
    )
}


class ChannelRepository:
    def list_accounts(self) -> list[ChannelAccountEntity]:
        return list(_SEED.values())

    def get_account(self, account_id: str) -> ChannelAccountEntity | None:
        return _SEED.get(account_id)

    def create_account(self, entity: ChannelAccountEntity) -> ChannelAccountEntity:
        return entity

    def update_account(self, account_id: str, updates: dict[str, object]) -> ChannelAccountEntity | None:
        existing = _SEED.get(account_id)
        if existing is None:
            return None
        return dc_replace(existing, **updates)

    def delete_account(self, account_id: str) -> bool:
        return account_id in _SEED

    def get_sync_status(self, account_id: str) -> SyncStatusEntity | None:
        if account_id not in _SEED:
            return None
        return SyncStatusEntity(
            account_id=account_id,
            sync_health="ready",
            latest_job_status="completed",
            last_completed_at="2026-03-27T08:00:00Z",
            conversations_indexed=312,
            messages_synced=4800,
            messages_live=12,
            pending_jobs=0,
        )

    def list_sync_jobs(self, account_id: str) -> list[SyncJobEntity]:
        if account_id not in _SEED:
            return []
        return [
            SyncJobEntity(
                id="sj000000-0000-0000-0000-000000000001",
                account_id=account_id,
                job_type="full_sync",
                status="completed",
                started_at="2026-03-27T07:50:00Z",
                ended_at="2026-03-27T08:00:00Z",
                error_detail=None,
                created_at="2026-03-27T07:49:00Z",
            )
        ]

