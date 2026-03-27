import uuid

from app.core.errors import not_found
from app.modules.templates.dtos.template_dto import CreateTemplateDto, TemplateDto, UpdateTemplateDto
from app.modules.templates.entities.template_entity import TemplateEntity
from app.modules.templates.repositories.template_repository import TemplateRepository


class TemplateService:
    def __init__(self, repository: TemplateRepository) -> None:
        self.repository = repository

    def _to_dto(self, item: TemplateEntity) -> TemplateDto:
        return TemplateDto(
            id=item.id,
            name=item.name,
            channel=item.channel,
            content=item.content,
            status=item.status,
        )

    def list_templates(self) -> list[TemplateDto]:
        return [self._to_dto(item) for item in self.repository.list_templates()]

    def get_template(self, template_id: str) -> TemplateDto:
        template = self.repository.get_template(template_id)
        if template is None:
            raise not_found("Template not found")
        return self._to_dto(template)

    def create_template(self, dto: CreateTemplateDto) -> TemplateDto:
        entity = TemplateEntity(
            id=str(uuid.uuid4()),
            name=dto.name,
            channel=dto.channel,
            content=dto.content,
            status=dto.status,
        )
        return self._to_dto(self.repository.create_template(entity))

    def update_template(self, template_id: str, dto: UpdateTemplateDto) -> TemplateDto:
        updates = {k: v for k, v in dto.model_dump().items() if v is not None}
        entity = self.repository.update_template(template_id, updates)
        if entity is None:
            raise not_found("Template not found")
        return self._to_dto(entity)

    def delete_template(self, template_id: str) -> None:
        if not self.repository.delete_template(template_id):
            raise not_found("Template not found")

