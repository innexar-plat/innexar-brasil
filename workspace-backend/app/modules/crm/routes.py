from fastapi import APIRouter, Depends, status

from app.core.auth_dependency import get_current_user
from app.modules.crm.controllers.crm_controller import CrmController
from app.modules.crm.dtos.crm_dto import (
    CrmDealDto,
    CrmLeadDto,
    CrmPipelineDto,
    CreateCrmDealDto,
    CreateCrmLeadDto,
    UpdateCrmDealDto,
    UpdateCrmLeadDto,
)

router = APIRouter(prefix="/crm", tags=["crm"])
controller = CrmController()


@router.get("/leads", response_model=list[CrmLeadDto], status_code=status.HTTP_200_OK)
def list_leads(_: str = Depends(get_current_user)) -> list[CrmLeadDto]:
    return controller.list_leads()


@router.post("/leads", response_model=CrmLeadDto, status_code=status.HTTP_201_CREATED)
def create_lead(dto: CreateCrmLeadDto, _: str = Depends(get_current_user)) -> CrmLeadDto:
    return controller.create_lead(dto)


@router.get("/leads/{lead_id}", response_model=CrmLeadDto, status_code=status.HTTP_200_OK)
def get_lead(lead_id: str, _: str = Depends(get_current_user)) -> CrmLeadDto:
    return controller.get_lead(lead_id)


@router.patch("/leads/{lead_id}", response_model=CrmLeadDto, status_code=status.HTTP_200_OK)
def update_lead(lead_id: str, dto: UpdateCrmLeadDto, _: str = Depends(get_current_user)) -> CrmLeadDto:
    return controller.update_lead(lead_id, dto)


@router.delete("/leads/{lead_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_lead(lead_id: str, _: str = Depends(get_current_user)) -> None:
    return controller.delete_lead(lead_id)


@router.get("/deals", response_model=list[CrmDealDto], status_code=status.HTTP_200_OK)
def list_deals(_: str = Depends(get_current_user)) -> list[CrmDealDto]:
    return controller.list_deals()


@router.post("/deals", response_model=CrmDealDto, status_code=status.HTTP_201_CREATED)
def create_deal(dto: CreateCrmDealDto, _: str = Depends(get_current_user)) -> CrmDealDto:
    return controller.create_deal(dto)


@router.get("/deals/{deal_id}", response_model=CrmDealDto, status_code=status.HTTP_200_OK)
def get_deal(deal_id: str, _: str = Depends(get_current_user)) -> CrmDealDto:
    return controller.get_deal(deal_id)


@router.patch("/deals/{deal_id}", response_model=CrmDealDto, status_code=status.HTTP_200_OK)
def update_deal(deal_id: str, dto: UpdateCrmDealDto, _: str = Depends(get_current_user)) -> CrmDealDto:
    return controller.update_deal(deal_id, dto)


@router.delete("/deals/{deal_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_deal(deal_id: str, _: str = Depends(get_current_user)) -> None:
    return controller.delete_deal(deal_id)


@router.get("/pipelines", response_model=list[CrmPipelineDto], status_code=status.HTTP_200_OK)
def list_pipelines(_: str = Depends(get_current_user)) -> list[CrmPipelineDto]:
    return controller.list_pipelines()


@router.get("/pipelines/{pipeline_id}", response_model=CrmPipelineDto, status_code=status.HTTP_200_OK)
def get_pipeline(pipeline_id: str, _: str = Depends(get_current_user)) -> CrmPipelineDto:
    return controller.get_pipeline(pipeline_id)

