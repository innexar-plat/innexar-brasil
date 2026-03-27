from dataclasses import replace as dc_replace

from app.modules.leads.entities.lead_entity import LeadEntity

_SEED: dict[str, LeadEntity] = {
    "70000000-0000-0000-0000-000000000001": LeadEntity(
        id="70000000-0000-0000-0000-000000000001",
        email="lead1@innexar.com",
        name="Lead One",
        source="website",
        status="new",
    )
}


class LeadRepository:
    def list_leads(self) -> list[LeadEntity]:
        return list(_SEED.values())

    def get_lead(self, lead_id: str) -> LeadEntity | None:
        return _SEED.get(lead_id)

    def create_lead(self, entity: LeadEntity) -> LeadEntity:
        return entity

    def update_lead(self, lead_id: str, updates: dict[str, object]) -> LeadEntity | None:
        existing = _SEED.get(lead_id)
        if existing is None:
            return None
        return dc_replace(existing, **updates)

    def delete_lead(self, lead_id: str) -> bool:
        return lead_id in _SEED

