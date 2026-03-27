from fastapi import APIRouter, Depends, status

from app.core.auth_dependency import get_current_user
from app.modules.agent_config.controllers.agent_config_controller import AgentConfigController
from app.modules.agent_config.dtos.agent_config_dto import (
    AgentConfigDto,
    CreateAgentConfigDto,
    EngagementPolicyDto,
    UpdateAgentConfigDto,
    UpdateEngagementPolicyDto,
)

router = APIRouter(prefix="/agent-config", tags=["agent-config"])
controller = AgentConfigController()


@router.get("", response_model=list[AgentConfigDto], status_code=status.HTTP_200_OK)
def list_configs(_: str = Depends(get_current_user)) -> list[AgentConfigDto]:
    return controller.list_configs()


@router.post("", response_model=AgentConfigDto, status_code=status.HTTP_201_CREATED)
def create_config(dto: CreateAgentConfigDto, _: str = Depends(get_current_user)) -> AgentConfigDto:
    return controller.create_config(dto)


@router.get("/policy", response_model=EngagementPolicyDto, status_code=status.HTTP_200_OK)
def get_policy(_: str = Depends(get_current_user)) -> EngagementPolicyDto:
    return controller.get_policy()


@router.patch("/policy", response_model=EngagementPolicyDto, status_code=status.HTTP_200_OK)
def update_policy(dto: UpdateEngagementPolicyDto, _: str = Depends(get_current_user)) -> EngagementPolicyDto:
    return controller.update_policy(dto)


@router.get("/{config_id}", response_model=AgentConfigDto, status_code=status.HTTP_200_OK)
def get_config(config_id: str, _: str = Depends(get_current_user)) -> AgentConfigDto:
    return controller.get_config(config_id)


@router.patch("/{config_id}", response_model=AgentConfigDto, status_code=status.HTTP_200_OK)
def update_config(config_id: str, dto: UpdateAgentConfigDto, _: str = Depends(get_current_user)) -> AgentConfigDto:
    return controller.update_config(config_id, dto)


@router.delete("/{config_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_config(config_id: str, _: str = Depends(get_current_user)) -> None:
    return controller.delete_config(config_id)

