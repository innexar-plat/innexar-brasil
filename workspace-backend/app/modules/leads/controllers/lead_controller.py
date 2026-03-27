from app.modules.leads.dtos.lead_dto import CreateLeadDto, LeadDto, UpdateLeadDto
from app.modules.leads.repositories.lead_repository import LeadRepository
from app.modules.leads.services.lead_service import LeadService


class LeadController:
    def __init__(self) -> None:
        repository = LeadRepository()
        self.service = LeadService(repository)

    def list_leads(self) -> list[LeadDto]:
        return self.service.list_leads()

    def get_lead(self, lead_id: str) -> LeadDto:
        return self.service.get_lead(lead_id)

    def create_lead(self, dto: CreateLeadDto) -> LeadDto:
        return self.service.create_lead(dto)

    def update_lead(self, lead_id: str, dto: UpdateLeadDto) -> LeadDto:
        return self.service.update_lead(lead_id, dto)

    def delete_lead(self, lead_id: str) -> None:
        return self.service.delete_lead(lead_id)

