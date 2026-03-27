from dataclasses import dataclass


@dataclass
class AgentRunEntity:
    id: str
    conversation_id: str
    run_type: str
    status: str
    model_provider: str | None
    model_name: str | None
    tokens_in: int
    tokens_out: int
    cost_usd: float
    latency_ms: int
    created_at: str


@dataclass
class AgentActionEntity:
    id: str
    run_id: str
    action_type: str
    target_type: str | None
    target_id: str | None
    status: str
    created_at: str
