from app.modules.agent_runs.dtos.agent_run_dto import AgentActionDto, AgentRunDto, CreateAgentRunDto
from app.modules.agent_runs.repositories.agent_run_repository import AgentRunRepository
from app.modules.agent_runs.services.agent_run_service import AgentRunService


class AgentRunController:
    def __init__(self) -> None:
        self.service = AgentRunService(AgentRunRepository())

    def list_runs(self) -> list[AgentRunDto]:
        return self.service.list_runs()

    def get_run(self, run_id: str) -> AgentRunDto:
        return self.service.get_run(run_id)

    def create_run(self, dto: CreateAgentRunDto) -> AgentRunDto:
        return self.service.create_run(dto)

    def list_actions(self, run_id: str) -> list[AgentActionDto]:
        return self.service.list_actions(run_id)

