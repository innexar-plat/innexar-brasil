import uuid

from app.core.errors import not_found
from app.modules.leads.dtos.lead_dto import CreateLeadDto, LeadDto, UpdateLeadDto
from app.modules.leads.entities.lead_entity import LeadEntity
from app.modules.leads.repositories.lead_repository import LeadRepository


class LeadService:
    def __init__(self, repository: LeadRepository) -> None:
        self.repository = repository

    def _to_dto(self, item: LeadEntity) -> LeadDto:
        return LeadDto(
            id=item.id,
            email=item.email,
            name=item.name,
            source=item.source,
            status=item.status,
        )

    def list_leads(self) -> list[LeadDto]:
        return [self._to_dto(item) for item in self.repository.list_leads()]

    def get_lead(self, lead_id: str) -> LeadDto:
        lead = self.repository.get_lead(lead_id)
        if lead is None:
            raise not_found("Lead not found")
        return self._to_dto(lead)

    def create_lead(self, dto: CreateLeadDto) -> LeadDto:
        entity = LeadEntity(
            id=str(uuid.uuid4()),
            email=dto.email,
            name=dto.name,
            source=dto.source,
            status=dto.status,
        )
        return self._to_dto(self.repository.create_lead(entity))

    def update_lead(self, lead_id: str, dto: UpdateLeadDto) -> LeadDto:
        updates = {k: v for k, v in dto.model_dump().items() if v is not None}
        entity = self.repository.update_lead(lead_id, updates)
        if entity is None:
            raise not_found("Lead not found")
        return self._to_dto(entity)

    def delete_lead(self, lead_id: str) -> None:
        if not self.repository.delete_lead(lead_id):
            raise not_found("Lead not found")

