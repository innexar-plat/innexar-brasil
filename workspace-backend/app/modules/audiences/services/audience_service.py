import uuid

from app.core.errors import not_found
from app.modules.audiences.dtos.audience_dto import AudienceDto, CreateAudienceDto, UpdateAudienceDto
from app.modules.audiences.entities.audience_entity import AudienceEntity
from app.modules.audiences.repositories.audience_repository import AudienceRepository


class AudienceService:
    def __init__(self, repository: AudienceRepository) -> None:
        self.repository = repository

    def _to_dto(self, item: AudienceEntity) -> AudienceDto:
        return AudienceDto(
            id=item.id,
            name=item.name,
            segment=item.segment,
            status=item.status,
        )

    def list_audiences(self) -> list[AudienceDto]:
        return [self._to_dto(item) for item in self.repository.list_audiences()]

    def get_audience(self, audience_id: str) -> AudienceDto:
        audience = self.repository.get_audience(audience_id)
        if audience is None:
            raise not_found("Audience not found")
        return self._to_dto(audience)

    def create_audience(self, dto: CreateAudienceDto) -> AudienceDto:
        entity = AudienceEntity(
            id=str(uuid.uuid4()),
            name=dto.name,
            segment=dto.segment,
            status=dto.status,
        )
        return self._to_dto(self.repository.create_audience(entity))

    def update_audience(self, audience_id: str, dto: UpdateAudienceDto) -> AudienceDto:
        updates = {k: v for k, v in dto.model_dump().items() if v is not None}
        entity = self.repository.update_audience(audience_id, updates)
        if entity is None:
            raise not_found("Audience not found")
        return self._to_dto(entity)

    def delete_audience(self, audience_id: str) -> None:
        if not self.repository.delete_audience(audience_id):
            raise not_found("Audience not found")

