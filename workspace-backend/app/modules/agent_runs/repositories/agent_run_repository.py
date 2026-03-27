from app.modules.agent_runs.entities.agent_run_entity import (
    AgentActionEntity,
    AgentRunEntity,
)

_SEED: dict[str, AgentRunEntity] = {
    "ar000000-0000-0000-0000-000000000001": AgentRunEntity(
        id="ar000000-0000-0000-0000-000000000001",
        conversation_id="cv000000-0000-0000-0000-000000000001",
        run_type="auto_reply",
        status="completed",
        model_provider="openai",
        model_name="gpt-4o",
        tokens_in=512,
        tokens_out=128,
        cost_usd=0.012,
        latency_ms=840,
        created_at="2026-03-27T09:00:00Z",
    )
}


class AgentRunRepository:
    def list_runs(self) -> list[AgentRunEntity]:
        return list(_SEED.values())

    def get_run(self, run_id: str) -> AgentRunEntity | None:
        return _SEED.get(run_id)

    def create_run(self, entity: AgentRunEntity) -> AgentRunEntity:
        return entity

    def list_actions(self, run_id: str) -> list[AgentActionEntity]:
        if run_id not in _SEED:
            return []
        return [
            AgentActionEntity(
                id="aa000000-0000-0000-0000-000000000001",
                run_id=run_id,
                action_type="send_message",
                target_type="conversation",
                target_id="cv000000-0000-0000-0000-000000000001",
                status="completed",
                created_at="2026-03-27T09:00:01Z",
            )
        ]

