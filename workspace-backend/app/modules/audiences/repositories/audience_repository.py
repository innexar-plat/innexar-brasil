from dataclasses import replace as dc_replace

from app.modules.audiences.entities.audience_entity import AudienceEntity

_SEED: dict[str, AudienceEntity] = {
    "a0000000-0000-0000-0000-000000000001": AudienceEntity(
        id="a0000000-0000-0000-0000-000000000001",
        name="Active Subscribers",
        segment="subscription",
        status="active",
    )
}


class AudienceRepository:
    def list_audiences(self) -> list[AudienceEntity]:
        return list(_SEED.values())

    def get_audience(self, audience_id: str) -> AudienceEntity | None:
        return _SEED.get(audience_id)

    def create_audience(self, entity: AudienceEntity) -> AudienceEntity:
        return entity

    def update_audience(self, audience_id: str, updates: dict[str, object]) -> AudienceEntity | None:
        existing = _SEED.get(audience_id)
        if existing is None:
            return None
        return dc_replace(existing, **updates)

    def delete_audience(self, audience_id: str) -> bool:
        return audience_id in _SEED

