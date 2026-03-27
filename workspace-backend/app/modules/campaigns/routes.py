from fastapi import APIRouter, Depends, status

from app.core.auth_dependency import get_current_user
from app.modules.campaigns.controllers.campaign_controller import CampaignController
from app.modules.campaigns.dtos.campaign_dto import CampaignDto, CreateCampaignDto, UpdateCampaignDto

router = APIRouter(prefix="/campaigns", tags=["campaigns"])
controller = CampaignController()


@router.get("", response_model=list[CampaignDto], status_code=status.HTTP_200_OK)
def list_campaigns(_: str = Depends(get_current_user)) -> list[CampaignDto]:
    return controller.list_campaigns()


@router.post("", response_model=CampaignDto, status_code=status.HTTP_201_CREATED)
def create_campaign(payload: CreateCampaignDto, _: str = Depends(get_current_user)) -> CampaignDto:
    return controller.create_campaign(payload)


@router.get("/{campaign_id}", response_model=CampaignDto, status_code=status.HTTP_200_OK)
def get_campaign(campaign_id: str, _: str = Depends(get_current_user)) -> CampaignDto:
    return controller.get_campaign(campaign_id)


@router.patch("/{campaign_id}", response_model=CampaignDto, status_code=status.HTTP_200_OK)
def update_campaign(
    campaign_id: str, payload: UpdateCampaignDto, _: str = Depends(get_current_user)
) -> CampaignDto:
    return controller.update_campaign(campaign_id, payload)


@router.delete("/{campaign_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_campaign(campaign_id: str, _: str = Depends(get_current_user)) -> None:
    controller.delete_campaign(campaign_id)

