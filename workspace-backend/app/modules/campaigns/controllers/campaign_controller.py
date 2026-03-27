from app.modules.campaigns.dtos.campaign_dto import CampaignDto, CreateCampaignDto, UpdateCampaignDto
from app.modules.campaigns.repositories.campaign_repository import CampaignRepository
from app.modules.campaigns.services.campaign_service import CampaignService


class CampaignController:
    def __init__(self) -> None:
        repository = CampaignRepository()
        self.service = CampaignService(repository)

    def list_campaigns(self) -> list[CampaignDto]:
        return self.service.list_campaigns()

    def get_campaign(self, campaign_id: str) -> CampaignDto:
        return self.service.get_campaign(campaign_id)

    def create_campaign(self, dto: CreateCampaignDto) -> CampaignDto:
        return self.service.create_campaign(dto)

    def update_campaign(self, campaign_id: str, dto: UpdateCampaignDto) -> CampaignDto:
        return self.service.update_campaign(campaign_id, dto)

    def delete_campaign(self, campaign_id: str) -> None:
        return self.service.delete_campaign(campaign_id)

