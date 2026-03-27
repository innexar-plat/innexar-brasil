from fastapi import APIRouter, Depends, status

from app.core.auth_dependency import get_current_user
from app.modules.leads.controllers.lead_controller import LeadController
from app.modules.leads.dtos.lead_dto import CreateLeadDto, LeadDto, UpdateLeadDto

router = APIRouter(prefix="/leads", tags=["leads"])
controller = LeadController()


@router.get("", response_model=list[LeadDto], status_code=status.HTTP_200_OK)
def list_leads(_: str = Depends(get_current_user)) -> list[LeadDto]:
    return controller.list_leads()


@router.post("", response_model=LeadDto, status_code=status.HTTP_201_CREATED)
def create_lead(payload: CreateLeadDto, _: str = Depends(get_current_user)) -> LeadDto:
    return controller.create_lead(payload)


@router.get("/{lead_id}", response_model=LeadDto, status_code=status.HTTP_200_OK)
def get_lead(lead_id: str, _: str = Depends(get_current_user)) -> LeadDto:
    return controller.get_lead(lead_id)


@router.patch("/{lead_id}", response_model=LeadDto, status_code=status.HTTP_200_OK)
def update_lead(
    lead_id: str, payload: UpdateLeadDto, _: str = Depends(get_current_user)
) -> LeadDto:
    return controller.update_lead(lead_id, payload)


@router.delete("/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lead(lead_id: str, _: str = Depends(get_current_user)) -> None:
    controller.delete_lead(lead_id)

