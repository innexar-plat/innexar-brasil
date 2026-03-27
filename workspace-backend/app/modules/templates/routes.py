from fastapi import APIRouter, Depends, status

from app.core.auth_dependency import get_current_user
from app.modules.templates.controllers.template_controller import TemplateController
from app.modules.templates.dtos.template_dto import CreateTemplateDto, TemplateDto, UpdateTemplateDto

router = APIRouter(prefix="/templates", tags=["templates"])
controller = TemplateController()


@router.get("", response_model=list[TemplateDto], status_code=status.HTTP_200_OK)
def list_templates(_: str = Depends(get_current_user)) -> list[TemplateDto]:
    return controller.list_templates()


@router.post("", response_model=TemplateDto, status_code=status.HTTP_201_CREATED)
def create_template(dto: CreateTemplateDto, _: str = Depends(get_current_user)) -> TemplateDto:
    return controller.create_template(dto)


@router.get("/{template_id}", response_model=TemplateDto, status_code=status.HTTP_200_OK)
def get_template(template_id: str, _: str = Depends(get_current_user)) -> TemplateDto:
    return controller.get_template(template_id)


@router.patch("/{template_id}", response_model=TemplateDto, status_code=status.HTTP_200_OK)
def update_template(template_id: str, dto: UpdateTemplateDto, _: str = Depends(get_current_user)) -> TemplateDto:
    return controller.update_template(template_id, dto)


@router.delete("/{template_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_template(template_id: str, _: str = Depends(get_current_user)) -> None:
    return controller.delete_template(template_id)

