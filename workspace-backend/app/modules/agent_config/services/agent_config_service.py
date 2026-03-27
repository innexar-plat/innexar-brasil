import uuid
from datetime import UTC, datetime

from app.core.errors import not_found
from app.modules.agent_config.dtos.agent_config_dto import (
    AgentConfigDto,
    CreateAgentConfigDto,
    EngagementPolicyDto,
    UpdateAgentConfigDto,
    UpdateEngagementPolicyDto,
)
from app.modules.agent_config.entities.agent_config_entity import AgentConfigEntity
from app.modules.agent_config.repositories.agent_config_repository import AgentConfigRepository


class AgentConfigService:
    def __init__(self, repository: AgentConfigRepository) -> None:
        self.repository = repository

    def _to_dto(self, item: AgentConfigEntity) -> AgentConfigDto:
        return AgentConfigDto(
            id=item.id,
            provider=item.provider,
            model_name=item.model_name,
            api_key_masked=item.api_key_masked,
            temperature=item.temperature,
            max_tokens=item.max_tokens,
            active=item.active,
            auto_reply_enabled=item.auto_reply_enabled,
            auto_classify_enabled=item.auto_classify_enabled,
            approval_required=item.approval_required,
            autonomous_mode=item.autonomous_mode,
            system_prompt=item.system_prompt,
            max_cost_per_run_usd=item.max_cost_per_run_usd,
            daily_budget_usd=item.daily_budget_usd,
            updated_at=item.updated_at,
        )

    def list_configs(self) -> list[AgentConfigDto]:
        return [self._to_dto(item) for item in self.repository.list_configs()]

    def get_config(self, config_id: str) -> AgentConfigDto:
        config = self.repository.get_config(config_id)
        if config is None:
            raise not_found("Agent config not found")
        return self._to_dto(config)

    def create_config(self, dto: CreateAgentConfigDto) -> AgentConfigDto:
        entity = AgentConfigEntity(
            id=str(uuid.uuid4()),
            provider=dto.provider,
            model_name=dto.model_name,
            api_key_masked=dto.api_key_masked,
            temperature=dto.temperature,
            max_tokens=dto.max_tokens,
            active=False,
            auto_reply_enabled=dto.auto_reply_enabled,
            auto_classify_enabled=dto.auto_classify_enabled,
            approval_required=dto.approval_required,
            autonomous_mode=dto.autonomous_mode,
            system_prompt=dto.system_prompt,
            max_cost_per_run_usd=dto.max_cost_per_run_usd,
            daily_budget_usd=dto.daily_budget_usd,
            updated_at=datetime.now(UTC).isoformat(),
        )
        return self._to_dto(self.repository.create_config(entity))

    def update_config(self, config_id: str, dto: UpdateAgentConfigDto) -> AgentConfigDto:
        updates = {k: v for k, v in dto.model_dump().items() if v is not None}
        entity = self.repository.update_config(config_id, updates)
        if entity is None:
            raise not_found("Agent config not found")
        return self._to_dto(entity)

    def delete_config(self, config_id: str) -> None:
        if not self.repository.delete_config(config_id):
            raise not_found("Agent config not found")

    def get_policy(self) -> EngagementPolicyDto:
        policy = self.repository.get_policy()
        return EngagementPolicyDto(
            id=policy.id,
            active=policy.active,
            mode=policy.mode,
            allow_price_sharing=policy.allow_price_sharing,
            auto_capture_from_new_messages=policy.auto_capture_from_new_messages,
            auto_reactivation_scan=policy.auto_reactivation_scan,
            auto_employee_coaching=policy.auto_employee_coaching,
        )

    def update_policy(self, dto: UpdateEngagementPolicyDto) -> EngagementPolicyDto:
        updates = {k: v for k, v in dto.model_dump().items() if v is not None}
        entity = self.repository.update_policy(updates)
        return EngagementPolicyDto(
            id=entity.id,
            active=entity.active,
            mode=entity.mode,
            allow_price_sharing=entity.allow_price_sharing,
            auto_capture_from_new_messages=entity.auto_capture_from_new_messages,
            auto_reactivation_scan=entity.auto_reactivation_scan,
            auto_employee_coaching=entity.auto_employee_coaching,
        )

