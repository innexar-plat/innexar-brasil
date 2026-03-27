import uuid

from app.core.errors import not_found
from app.modules.campaigns.dtos.campaign_dto import CampaignDto, CreateCampaignDto, UpdateCampaignDto
from app.modules.campaigns.entities.campaign_entity import CampaignEntity
from app.modules.campaigns.repositories.campaign_repository import CampaignRepository


class CampaignService:
    def __init__(self, repository: CampaignRepository) -> None:
        self.repository = repository

    def _to_dto(self, item: CampaignEntity) -> CampaignDto:
        return CampaignDto(
            id=item.id,
            name=item.name,
            channel=item.channel,
            status=item.status,
        )

    def list_campaigns(self) -> list[CampaignDto]:
        return [self._to_dto(item) for item in self.repository.list_campaigns()]

    def get_campaign(self, campaign_id: str) -> CampaignDto:
        campaign = self.repository.get_campaign(campaign_id)
        if campaign is None:
            raise not_found("Campaign not found")
        return self._to_dto(campaign)

    def create_campaign(self, dto: CreateCampaignDto) -> CampaignDto:
        entity = CampaignEntity(
            id=str(uuid.uuid4()),
            name=dto.name,
            channel=dto.channel,
            status=dto.status,
        )
        return self._to_dto(self.repository.create_campaign(entity))

    def update_campaign(self, campaign_id: str, dto: UpdateCampaignDto) -> CampaignDto:
        updates = {k: v for k, v in dto.model_dump().items() if v is not None}
        entity = self.repository.update_campaign(campaign_id, updates)
        if entity is None:
            raise not_found("Campaign not found")
        return self._to_dto(entity)

    def delete_campaign(self, campaign_id: str) -> None:
        if not self.repository.delete_campaign(campaign_id):
            raise not_found("Campaign not found")

