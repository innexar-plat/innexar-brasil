from pydantic import BaseModel, ConfigDict, Field


class AgentRunDto(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    id: str
    conversation_id: str
    run_type: str = Field(min_length=1, max_length=50)
    status: str = Field(min_length=1, max_length=30)
    model_provider: str | None = None
    model_name: str | None = None
    tokens_in: int
    tokens_out: int
    cost_usd: float
    latency_ms: int
    created_at: str


class CreateAgentRunDto(BaseModel):
    conversation_id: str
    run_type: str = Field(default="manual", min_length=1, max_length=50)


class AgentActionDto(BaseModel):
    id: str
    run_id: str
    action_type: str = Field(min_length=1, max_length=50)
    target_type: str | None = None
    target_id: str | None = None
    status: str = Field(min_length=1, max_length=30)
    created_at: str

