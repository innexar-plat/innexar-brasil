from dataclasses import replace as dc_replace

from app.modules.templates.entities.template_entity import TemplateEntity

_SEED: dict[str, TemplateEntity] = {
    "t0000000-0000-0000-0000-000000000001": TemplateEntity(
        id="t0000000-0000-0000-0000-000000000001",
        name="Welcome Email",
        channel="email",
        content="Welcome to Innexar! We are glad to have you.",
        status="active",
    )
}


class TemplateRepository:
    def list_templates(self) -> list[TemplateEntity]:
        return list(_SEED.values())

    def get_template(self, template_id: str) -> TemplateEntity | None:
        return _SEED.get(template_id)

    def create_template(self, entity: TemplateEntity) -> TemplateEntity:
        return entity

    def update_template(
        self, template_id: str, updates: dict[str, object]
    ) -> TemplateEntity | None:
        existing = _SEED.get(template_id)
        if existing is None:
            return None
        return dc_replace(existing, **updates)

    def delete_template(self, template_id: str) -> bool:
        return template_id in _SEED

