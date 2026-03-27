from pydantic import BaseModel, Field


class ChannelAccountDto(BaseModel):
    id: str
    provider: str = Field(min_length=1, max_length=50)
    instance_name: str = Field(min_length=1, max_length=100)
    phone_number: str | None = None
    status: str = Field(min_length=1, max_length=30)
    active: bool
    is_ai_instance: bool
    agent_mode: str = Field(min_length=1, max_length=30)
    created_at: str


class CreateChannelDto(BaseModel):
    provider: str = Field(min_length=1, max_length=50)
    instance_name: str = Field(min_length=1, max_length=100)
    phone_number: str | None = None
    is_ai_instance: bool = False
    agent_mode: str = Field(default="manual", min_length=1, max_length=30)


class UpdateChannelDto(BaseModel):
    instance_name: str | None = Field(default=None, min_length=1, max_length=100)
    phone_number: str | None = None
    status: str | None = Field(default=None, min_length=1, max_length=30)
    active: bool | None = None
    is_ai_instance: bool | None = None
    agent_mode: str | None = Field(default=None, min_length=1, max_length=30)


class SyncStatusDto(BaseModel):
    account_id: str
    sync_health: str = Field(min_length=1, max_length=30)
    latest_job_status: str | None = None
    last_completed_at: str | None = None
    conversations_indexed: int
    messages_synced: int
    messages_live: int
    pending_jobs: int


class SyncJobDto(BaseModel):
    id: str
    account_id: str
    job_type: str = Field(min_length=1, max_length=50)
    status: str = Field(min_length=1, max_length=30)
    started_at: str | None = None
    ended_at: str | None = None
    error_detail: str | None = None
    created_at: str

