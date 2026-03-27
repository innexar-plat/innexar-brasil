from dataclasses import replace as dc_replace

from app.modules.campaigns.entities.campaign_entity import CampaignEntity

_SEED: dict[str, CampaignEntity] = {
    "90000000-0000-0000-0000-000000000001": CampaignEntity(
        id="90000000-0000-0000-0000-000000000001",
        name="Q1 Retention Boost",
        channel="email",
        status="active",
    )
}


class CampaignRepository:
    def list_campaigns(self) -> list[CampaignEntity]:
        return list(_SEED.values())

    def get_campaign(self, campaign_id: str) -> CampaignEntity | None:
        return _SEED.get(campaign_id)

    def create_campaign(self, entity: CampaignEntity) -> CampaignEntity:
        return entity

    def update_campaign(self, campaign_id: str, updates: dict[str, object]) -> CampaignEntity | None:
        existing = _SEED.get(campaign_id)
        if existing is None:
            return None
        return dc_replace(existing, **updates)

    def delete_campaign(self, campaign_id: str) -> bool:
        return campaign_id in _SEED

