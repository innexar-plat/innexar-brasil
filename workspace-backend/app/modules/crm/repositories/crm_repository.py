from dataclasses import replace as dc_replace

from app.modules.crm.entities.crm_entity import (
    CrmDealEntity,
    CrmLeadEntity,
    CrmPipelineEntity,
    CrmPipelineStageEntity,
)

_LEAD_SEED: dict[str, CrmLeadEntity] = {
    "cl000000-0000-0000-0000-000000000001": CrmLeadEntity(
        id="cl000000-0000-0000-0000-000000000001",
        name="João Oliveira",
        email="joao.oliveira@example.com",
        phone="+55 11 98888-0001",
        source="website",
        status="qualified",
        score=72,
        created_at="2026-03-10T10:00:00Z",
    )
}

_DEAL_SEED: dict[str, CrmDealEntity] = {
    "cd000000-0000-0000-0000-000000000001": CrmDealEntity(
        id="cd000000-0000-0000-0000-000000000001",
        title="Site Pro — João Oliveira",
        value=199.0,
        stage_id="cs000000-0000-0000-0000-000000000001",
        lead_id="cl000000-0000-0000-0000-000000000001",
        closing_date="2026-04-01",
        status="open",
        created_at="2026-03-15T10:00:00Z",
    )
}

_PIPELINE_STAGES = [
    CrmPipelineStageEntity(
        id="cs000000-0000-0000-0000-000000000001",
        pipeline_id="cp000000-0000-0000-0000-000000000001",
        name="Proposal",
        order=1,
        probability=0.4,
    ),
    CrmPipelineStageEntity(
        id="cs000000-0000-0000-0000-000000000002",
        pipeline_id="cp000000-0000-0000-0000-000000000001",
        name="Negotiation",
        order=2,
        probability=0.7,
    ),
    CrmPipelineStageEntity(
        id="cs000000-0000-0000-0000-000000000003",
        pipeline_id="cp000000-0000-0000-0000-000000000001",
        name="Closed Won",
        order=3,
        probability=1.0,
    ),
]

_PIPELINE_SEED: dict[str, CrmPipelineEntity] = {
    "cp000000-0000-0000-0000-000000000001": CrmPipelineEntity(
        id="cp000000-0000-0000-0000-000000000001",
        name="Sales Pipeline",
        stages=_PIPELINE_STAGES,
    )
}


class CrmRepository:
    # --- leads ---
    def list_leads(self) -> list[CrmLeadEntity]:
        return list(_LEAD_SEED.values())

    def get_lead(self, lead_id: str) -> CrmLeadEntity | None:
        return _LEAD_SEED.get(lead_id)

    def create_lead(self, entity: CrmLeadEntity) -> CrmLeadEntity:
        return entity

    def update_lead(self, lead_id: str, updates: dict[str, object]) -> CrmLeadEntity | None:
        existing = _LEAD_SEED.get(lead_id)
        if existing is None:
            return None
        return dc_replace(existing, **updates)

    def delete_lead(self, lead_id: str) -> bool:
        return lead_id in _LEAD_SEED

    # --- deals ---
    def list_deals(self) -> list[CrmDealEntity]:
        return list(_DEAL_SEED.values())

    def get_deal(self, deal_id: str) -> CrmDealEntity | None:
        return _DEAL_SEED.get(deal_id)

    def create_deal(self, entity: CrmDealEntity) -> CrmDealEntity:
        return entity

    def update_deal(self, deal_id: str, updates: dict[str, object]) -> CrmDealEntity | None:
        existing = _DEAL_SEED.get(deal_id)
        if existing is None:
            return None
        return dc_replace(existing, **updates)

    def delete_deal(self, deal_id: str) -> bool:
        return deal_id in _DEAL_SEED

    # --- pipelines ---
    def list_pipelines(self) -> list[CrmPipelineEntity]:
        return list(_PIPELINE_SEED.values())

    def get_pipeline(self, pipeline_id: str) -> CrmPipelineEntity | None:
        return _PIPELINE_SEED.get(pipeline_id)

