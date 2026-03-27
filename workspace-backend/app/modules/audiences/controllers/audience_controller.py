from app.modules.audiences.dtos.audience_dto import AudienceDto, CreateAudienceDto, UpdateAudienceDto
from app.modules.audiences.repositories.audience_repository import AudienceRepository
from app.modules.audiences.services.audience_service import AudienceService


class AudienceController:
    def __init__(self) -> None:
        repository = AudienceRepository()
        self.service = AudienceService(repository)

    def list_audiences(self) -> list[AudienceDto]:
        return self.service.list_audiences()

    def get_audience(self, audience_id: str) -> AudienceDto:
        return self.service.get_audience(audience_id)

    def create_audience(self, dto: CreateAudienceDto) -> AudienceDto:
        return self.service.create_audience(dto)

    def update_audience(self, audience_id: str, dto: UpdateAudienceDto) -> AudienceDto:
        return self.service.update_audience(audience_id, dto)

    def delete_audience(self, audience_id: str) -> None:
        return self.service.delete_audience(audience_id)

