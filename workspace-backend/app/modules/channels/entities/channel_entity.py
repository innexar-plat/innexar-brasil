from dataclasses import dataclass


@dataclass
class ChannelAccountEntity:
    id: str
    provider: str
    instance_name: str
    phone_number: str | None
    status: str
    active: bool
    is_ai_instance: bool
    agent_mode: str
    created_at: str


@dataclass
class SyncStatusEntity:
    account_id: str
    sync_health: str
    latest_job_status: str | None
    last_completed_at: str | None
    conversations_indexed: int
    messages_synced: int
    messages_live: int
    pending_jobs: int


@dataclass
class SyncJobEntity:
    id: str
    account_id: str
    job_type: str
    status: str
    started_at: str | None
    ended_at: str | None
    error_detail: str | None
    created_at: str
