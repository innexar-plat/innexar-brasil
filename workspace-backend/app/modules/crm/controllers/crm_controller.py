from app.modules.crm.dtos.crm_dto import (
    CrmDealDto,
    CrmLeadDto,
    CrmPipelineDto,
    CreateCrmDealDto,
    CreateCrmLeadDto,
    UpdateCrmDealDto,
    UpdateCrmLeadDto,
)
from app.modules.crm.repositories.crm_repository import CrmRepository
from app.modules.crm.services.crm_service import CrmService


class CrmController:
    def __init__(self) -> None:
        self.service = CrmService(CrmRepository())

    def list_leads(self) -> list[CrmLeadDto]:
        return self.service.list_leads()

    def get_lead(self, lead_id: str) -> CrmLeadDto:
        return self.service.get_lead(lead_id)

    def create_lead(self, dto: CreateCrmLeadDto) -> CrmLeadDto:
        return self.service.create_lead(dto)

    def update_lead(self, lead_id: str, dto: UpdateCrmLeadDto) -> CrmLeadDto:
        return self.service.update_lead(lead_id, dto)

    def delete_lead(self, lead_id: str) -> None:
        return self.service.delete_lead(lead_id)

    def list_deals(self) -> list[CrmDealDto]:
        return self.service.list_deals()

    def get_deal(self, deal_id: str) -> CrmDealDto:
        return self.service.get_deal(deal_id)

    def create_deal(self, dto: CreateCrmDealDto) -> CrmDealDto:
        return self.service.create_deal(dto)

    def update_deal(self, deal_id: str, dto: UpdateCrmDealDto) -> CrmDealDto:
        return self.service.update_deal(deal_id, dto)

    def delete_deal(self, deal_id: str) -> None:
        return self.service.delete_deal(deal_id)

    def list_pipelines(self) -> list[CrmPipelineDto]:
        return self.service.list_pipelines()

    def get_pipeline(self, pipeline_id: str) -> CrmPipelineDto:
        return self.service.get_pipeline(pipeline_id)

