from app.modules.agent_config.dtos.agent_config_dto import (
    AgentConfigDto,
    CreateAgentConfigDto,
    EngagementPolicyDto,
    UpdateAgentConfigDto,
    UpdateEngagementPolicyDto,
)
from app.modules.agent_config.repositories.agent_config_repository import AgentConfigRepository
from app.modules.agent_config.services.agent_config_service import AgentConfigService


class AgentConfigController:
    def __init__(self) -> None:
        self.service = AgentConfigService(AgentConfigRepository())

    def list_configs(self) -> list[AgentConfigDto]:
        return self.service.list_configs()

    def get_config(self, config_id: str) -> AgentConfigDto:
        return self.service.get_config(config_id)

    def create_config(self, dto: CreateAgentConfigDto) -> AgentConfigDto:
        return self.service.create_config(dto)

    def update_config(self, config_id: str, dto: UpdateAgentConfigDto) -> AgentConfigDto:
        return self.service.update_config(config_id, dto)

    def delete_config(self, config_id: str) -> None:
        return self.service.delete_config(config_id)

    def get_policy(self) -> EngagementPolicyDto:
        return self.service.get_policy()

    def update_policy(self, dto: UpdateEngagementPolicyDto) -> EngagementPolicyDto:
        return self.service.update_policy(dto)

