from pydantic import BaseModel, Field


class CrmLeadDto(BaseModel):
    id: str
    name: str = Field(min_length=1, max_length=255)
    email: str | None = None
    phone: str | None = None
    source: str | None = None
    status: str = Field(min_length=1, max_length=30)
    score: int | None = None
    created_at: str


class CreateCrmLeadDto(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    email: str | None = None
    phone: str | None = None
    source: str | None = None
    status: str = Field(default="new", min_length=1, max_length=30)
    score: int | None = None


class UpdateCrmLeadDto(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    email: str | None = None
    phone: str | None = None
    source: str | None = None
    status: str | None = Field(default=None, min_length=1, max_length=30)
    score: int | None = None


class CrmDealDto(BaseModel):
    id: str
    title: str = Field(min_length=1, max_length=255)
    value: float | None = None
    stage_id: str | None = None
    lead_id: str | None = None
    closing_date: str | None = None
    status: str = Field(min_length=1, max_length=30)
    created_at: str


class CreateCrmDealDto(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    value: float | None = None
    stage_id: str | None = None
    lead_id: str | None = None
    closing_date: str | None = None
    status: str = Field(default="open", min_length=1, max_length=30)


class UpdateCrmDealDto(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    value: float | None = None
    stage_id: str | None = None
    closing_date: str | None = None
    status: str | None = Field(default=None, min_length=1, max_length=30)


class CrmPipelineStageDto(BaseModel):
    id: str
    pipeline_id: str
    name: str = Field(min_length=1, max_length=100)
    order: int
    probability: float | None = None


class CrmPipelineDto(BaseModel):
    id: str
    name: str = Field(min_length=1, max_length=255)
    stages: list[CrmPipelineStageDto] = []

