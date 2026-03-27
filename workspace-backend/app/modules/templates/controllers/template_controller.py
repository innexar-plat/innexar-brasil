from app.modules.templates.dtos.template_dto import CreateTemplateDto, TemplateDto, UpdateTemplateDto
from app.modules.templates.repositories.template_repository import TemplateRepository
from app.modules.templates.services.template_service import TemplateService


class TemplateController:
    def __init__(self) -> None:
        repository = TemplateRepository()
        self.service = TemplateService(repository)

    def list_templates(self) -> list[TemplateDto]:
        return self.service.list_templates()

    def get_template(self, template_id: str) -> TemplateDto:
        return self.service.get_template(template_id)

    def create_template(self, dto: CreateTemplateDto) -> TemplateDto:
        return self.service.create_template(dto)

    def update_template(self, template_id: str, dto: UpdateTemplateDto) -> TemplateDto:
        return self.service.update_template(template_id, dto)

    def delete_template(self, template_id: str) -> None:
        return self.service.delete_template(template_id)
