from pydantic import BaseModel, ConfigDict, Field


class AgentConfigDto(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    id: str
    provider: str = Field(min_length=1, max_length=50)
    model_name: str = Field(min_length=1, max_length=100)
    api_key_masked: str
    temperature: float
    max_tokens: int
    active: bool
    auto_reply_enabled: bool
    auto_classify_enabled: bool
    approval_required: bool
    autonomous_mode: bool
    system_prompt: str | None = None
    max_cost_per_run_usd: float
    daily_budget_usd: float
    updated_at: str


class CreateAgentConfigDto(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    provider: str = Field(min_length=1, max_length=50)
    model_name: str = Field(min_length=1, max_length=100)
    api_key_masked: str
    temperature: float = 0.3
    max_tokens: int = 2048
    auto_reply_enabled: bool = False
    auto_classify_enabled: bool = False
    approval_required: bool = True
    autonomous_mode: bool = False
    system_prompt: str | None = None
    max_cost_per_run_usd: float = 0.05
    daily_budget_usd: float = 5.0


class UpdateAgentConfigDto(BaseModel):
    model_config = ConfigDict(protected_namespaces=())

    model_name: str | None = Field(default=None, min_length=1, max_length=100)
    temperature: float | None = None
    max_tokens: int | None = None
    active: bool | None = None
    auto_reply_enabled: bool | None = None
    auto_classify_enabled: bool | None = None
    approval_required: bool | None = None
    autonomous_mode: bool | None = None
    system_prompt: str | None = None
    max_cost_per_run_usd: float | None = None
    daily_budget_usd: float | None = None


class EngagementPolicyDto(BaseModel):
    id: str
    active: bool
    mode: str = Field(min_length=1, max_length=20)
    allow_price_sharing: bool
    auto_capture_from_new_messages: bool
    auto_reactivation_scan: bool
    auto_employee_coaching: bool


class UpdateEngagementPolicyDto(BaseModel):
    active: bool | None = None
    mode: str | None = Field(default=None, min_length=1, max_length=20)
    allow_price_sharing: bool | None = None
    auto_capture_from_new_messages: bool | None = None
    auto_reactivation_scan: bool | None = None
    auto_employee_coaching: bool | None = None

