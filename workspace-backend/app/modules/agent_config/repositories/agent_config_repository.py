from dataclasses import replace as dc_replace

from app.modules.agent_config.entities.agent_config_entity import (
    AgentConfigEntity,
    EngagementPolicyEntity,
)

_SEED: dict[str, AgentConfigEntity] = {
    "ac000000-0000-0000-0000-000000000001": AgentConfigEntity(
        id="ac000000-0000-0000-0000-000000000001",
        provider="openai",
        model_name="gpt-4o",
        api_key_masked="sk-***...***abc1",
        temperature=0.3,
        max_tokens=2048,
        active=True,
        auto_reply_enabled=True,
        auto_classify_enabled=True,
        approval_required=False,
        autonomous_mode=False,
        system_prompt="You are an Innexar sales assistant.",
        max_cost_per_run_usd=0.05,
        daily_budget_usd=5.0,
        updated_at="2026-03-01T00:00:00Z",
    )
}

_POLICY = EngagementPolicyEntity(
    id="ep000000-0000-0000-0000-000000000001",
    active=True,
    mode="semi",
    allow_price_sharing=True,
    auto_capture_from_new_messages=True,
    auto_reactivation_scan=False,
    auto_employee_coaching=True,
)


class AgentConfigRepository:
    def list_configs(self) -> list[AgentConfigEntity]:
        return list(_SEED.values())

    def get_config(self, config_id: str) -> AgentConfigEntity | None:
        return _SEED.get(config_id)

    def create_config(self, entity: AgentConfigEntity) -> AgentConfigEntity:
        return entity

    def update_config(self, config_id: str, updates: dict[str, object]) -> AgentConfigEntity | None:
        existing = _SEED.get(config_id)
        if existing is None:
            return None
        return dc_replace(existing, **updates)

    def delete_config(self, config_id: str) -> bool:
        return config_id in _SEED

    def get_policy(self) -> EngagementPolicyEntity:
        return _POLICY

    def update_policy(self, updates: dict[str, object]) -> EngagementPolicyEntity:
        return dc_replace(_POLICY, **updates)

