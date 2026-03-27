from fastapi import APIRouter, Depends, status

from app.core.auth_dependency import get_current_user
from app.modules.agent_runs.controllers.agent_run_controller import AgentRunController
from app.modules.agent_runs.dtos.agent_run_dto import AgentActionDto, AgentRunDto, CreateAgentRunDto

router = APIRouter(prefix="/agent-runs", tags=["agent-runs"])
controller = AgentRunController()


@router.get("", response_model=list[AgentRunDto], status_code=status.HTTP_200_OK)
def list_runs(_: str = Depends(get_current_user)) -> list[AgentRunDto]:
    return controller.list_runs()


@router.post("", response_model=AgentRunDto, status_code=status.HTTP_201_CREATED)
def create_run(dto: CreateAgentRunDto, _: str = Depends(get_current_user)) -> AgentRunDto:
    return controller.create_run(dto)


@router.get("/{run_id}", response_model=AgentRunDto, status_code=status.HTTP_200_OK)
def get_run(run_id: str, _: str = Depends(get_current_user)) -> AgentRunDto:
    return controller.get_run(run_id)


@router.get("/{run_id}/actions", response_model=list[AgentActionDto], status_code=status.HTTP_200_OK)
def list_actions(run_id: str, _: str = Depends(get_current_user)) -> list[AgentActionDto]:
    return controller.list_actions(run_id)

