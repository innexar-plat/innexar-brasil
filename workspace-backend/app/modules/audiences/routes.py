from fastapi import APIRouter, Depends, status

from app.core.auth_dependency import get_current_user
from app.modules.audiences.controllers.audience_controller import AudienceController
from app.modules.audiences.dtos.audience_dto import AudienceDto, CreateAudienceDto, UpdateAudienceDto

router = APIRouter(prefix="/audiences", tags=["audiences"])
controller = AudienceController()


@router.get("", response_model=list[AudienceDto], status_code=status.HTTP_200_OK)
def list_audiences(_: str = Depends(get_current_user)) -> list[AudienceDto]:
    return controller.list_audiences()


@router.post("", response_model=AudienceDto, status_code=status.HTTP_201_CREATED)
def create_audience(
    payload: CreateAudienceDto, _: str = Depends(get_current_user)
) -> AudienceDto:
    return controller.create_audience(payload)


@router.get("/{audience_id}", response_model=AudienceDto, status_code=status.HTTP_200_OK)
def get_audience(audience_id: str, _: str = Depends(get_current_user)) -> AudienceDto:
    return controller.get_audience(audience_id)


@router.patch("/{audience_id}", response_model=AudienceDto, status_code=status.HTTP_200_OK)
def update_audience(
    audience_id: str, payload: UpdateAudienceDto, _: str = Depends(get_current_user)
) -> AudienceDto:
    return controller.update_audience(audience_id, payload)


@router.delete("/{audience_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_audience(audience_id: str, _: str = Depends(get_current_user)) -> None:
    controller.delete_audience(audience_id)

