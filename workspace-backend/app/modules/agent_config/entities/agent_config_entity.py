from dataclasses import dataclass


@dataclass
class AgentConfigEntity:
    id: str
    provider: str
    model_name: str
    api_key_masked: str
    temperature: float
    max_tokens: int
    active: bool
    auto_reply_enabled: bool
    auto_classify_enabled: bool
    approval_required: bool
    autonomous_mode: bool
    system_prompt: str | None
    max_cost_per_run_usd: float
    daily_budget_usd: float
    updated_at: str


@dataclass
class EngagementPolicyEntity:
    id: str
    active: bool
    mode: str
    allow_price_sharing: bool
    auto_capture_from_new_messages: bool
    auto_reactivation_scan: bool
    auto_employee_coaching: bool
