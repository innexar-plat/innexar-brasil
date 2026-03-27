import uuid
from datetime import UTC, datetime

from app.core.errors import not_found
from app.modules.crm.dtos.crm_dto import (
    CrmDealDto,
    CrmLeadDto,
    CrmPipelineDto,
    CrmPipelineStageDto,
    CreateCrmDealDto,
    CreateCrmLeadDto,
    UpdateCrmDealDto,
    UpdateCrmLeadDto,
)
from app.modules.crm.entities.crm_entity import CrmDealEntity, CrmLeadEntity
from app.modules.crm.repositories.crm_repository import CrmRepository


class CrmService:
    def __init__(self, repository: CrmRepository) -> None:
        self.repository = repository

    def _lead_to_dto(self, item: CrmLeadEntity) -> CrmLeadDto:
        return CrmLeadDto(
            id=item.id,
            name=item.name,
            email=item.email,
            phone=item.phone,
            source=item.source,
            status=item.status,
            score=item.score,
            created_at=item.created_at,
        )

    def _deal_to_dto(self, item: CrmDealEntity) -> CrmDealDto:
        return CrmDealDto(
            id=item.id,
            title=item.title,
            value=item.value,
            stage_id=item.stage_id,
            lead_id=item.lead_id,
            closing_date=item.closing_date,
            status=item.status,
            created_at=item.created_at,
        )

    def list_leads(self) -> list[CrmLeadDto]:
        return [self._lead_to_dto(item) for item in self.repository.list_leads()]

    def get_lead(self, lead_id: str) -> CrmLeadDto:
        lead = self.repository.get_lead(lead_id)
        if lead is None:
            raise not_found("CRM lead not found")
        return self._lead_to_dto(lead)

    def create_lead(self, dto: CreateCrmLeadDto) -> CrmLeadDto:
        entity = CrmLeadEntity(
            id=str(uuid.uuid4()),
            name=dto.name,
            email=dto.email,
            phone=dto.phone,
            source=dto.source,
            status=dto.status,
            score=dto.score,
            created_at=datetime.now(UTC).isoformat(),
        )
        return self._lead_to_dto(self.repository.create_lead(entity))

    def update_lead(self, lead_id: str, dto: UpdateCrmLeadDto) -> CrmLeadDto:
        updates = {k: v for k, v in dto.model_dump().items() if v is not None}
        entity = self.repository.update_lead(lead_id, updates)
        if entity is None:
            raise not_found("CRM lead not found")
        return self._lead_to_dto(entity)

    def delete_lead(self, lead_id: str) -> None:
        if not self.repository.delete_lead(lead_id):
            raise not_found("CRM lead not found")

    def list_deals(self) -> list[CrmDealDto]:
        return [self._deal_to_dto(item) for item in self.repository.list_deals()]

    def get_deal(self, deal_id: str) -> CrmDealDto:
        deal = self.repository.get_deal(deal_id)
        if deal is None:
            raise not_found("CRM deal not found")
        return self._deal_to_dto(deal)

    def create_deal(self, dto: CreateCrmDealDto) -> CrmDealDto:
        entity = CrmDealEntity(
            id=str(uuid.uuid4()),
            title=dto.title,
            value=dto.value,
            stage_id=dto.stage_id,
            lead_id=dto.lead_id,
            closing_date=dto.closing_date,
            status=dto.status,
            created_at=datetime.now(UTC).isoformat(),
        )
        return self._deal_to_dto(self.repository.create_deal(entity))

    def update_deal(self, deal_id: str, dto: UpdateCrmDealDto) -> CrmDealDto:
        updates = {k: v for k, v in dto.model_dump().items() if v is not None}
        entity = self.repository.update_deal(deal_id, updates)
        if entity is None:
            raise not_found("CRM deal not found")
        return self._deal_to_dto(entity)

    def delete_deal(self, deal_id: str) -> None:
        if not self.repository.delete_deal(deal_id):
            raise not_found("CRM deal not found")

    def list_pipelines(self) -> list[CrmPipelineDto]:
        return [
            CrmPipelineDto(
                id=item.id,
                name=item.name,
                stages=[
                    CrmPipelineStageDto(
                        id=s.id,
                        pipeline_id=s.pipeline_id,
                        name=s.name,
                        order=s.order,
                        probability=s.probability,
                    )
                    for s in item.stages
                ],
            )
            for item in self.repository.list_pipelines()
        ]

    def get_pipeline(self, pipeline_id: str) -> CrmPipelineDto:
        pipeline = self.repository.get_pipeline(pipeline_id)
        if pipeline is None:
            raise not_found("CRM pipeline not found")
        return CrmPipelineDto(
            id=pipeline.id,
            name=pipeline.name,
            stages=[
                CrmPipelineStageDto(
                    id=s.id,
                    pipeline_id=s.pipeline_id,
                    name=s.name,
                    order=s.order,
                    probability=s.probability,
                )
                for s in pipeline.stages
            ],
        )

