import uuid
from datetime import UTC, datetime

from app.core.errors import not_found
from app.modules.agent_runs.dtos.agent_run_dto import AgentActionDto, AgentRunDto, CreateAgentRunDto
from app.modules.agent_runs.entities.agent_run_entity import AgentRunEntity
from app.modules.agent_runs.repositories.agent_run_repository import AgentRunRepository


class AgentRunService:
    def __init__(self, repository: AgentRunRepository) -> None:
        self.repository = repository

    def _to_dto(self, item: AgentRunEntity) -> AgentRunDto:
        return AgentRunDto(
            id=item.id,
            conversation_id=item.conversation_id,
            run_type=item.run_type,
            status=item.status,
            model_provider=item.model_provider,
            model_name=item.model_name,
            tokens_in=item.tokens_in,
            tokens_out=item.tokens_out,
            cost_usd=item.cost_usd,
            latency_ms=item.latency_ms,
            created_at=item.created_at,
        )

    def list_runs(self) -> list[AgentRunDto]:
        return [self._to_dto(item) for item in self.repository.list_runs()]

    def get_run(self, run_id: str) -> AgentRunDto:
        run = self.repository.get_run(run_id)
        if run is None:
            raise not_found("Agent run not found")
        return self._to_dto(run)

    def create_run(self, dto: CreateAgentRunDto) -> AgentRunDto:
        entity = AgentRunEntity(
            id=str(uuid.uuid4()),
            conversation_id=dto.conversation_id,
            run_type=dto.run_type,
            status="pending",
            model_provider=None,
            model_name=None,
            tokens_in=0,
            tokens_out=0,
            cost_usd=0.0,
            latency_ms=0,
            created_at=datetime.now(UTC).isoformat(),
        )
        return self._to_dto(self.repository.create_run(entity))

    def list_actions(self, run_id: str) -> list[AgentActionDto]:
        return [
            AgentActionDto(
                id=item.id,
                run_id=item.run_id,
                action_type=item.action_type,
                target_type=item.target_type,
                target_id=item.target_id,
                status=item.status,
                created_at=item.created_at,
            )
            for item in self.repository.list_actions(run_id)
        ]

