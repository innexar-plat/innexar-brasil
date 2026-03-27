from dataclasses import dataclass, field


@dataclass
class CrmLeadEntity:
    id: str
    name: str
    email: str | None
    phone: str | None
    source: str | None
    status: str
    score: int | None
    created_at: str


@dataclass
class CrmDealEntity:
    id: str
    title: str
    value: float | None
    stage_id: str | None
    lead_id: str | None
    closing_date: str | None
    status: str
    created_at: str


@dataclass
class CrmPipelineStageEntity:
    id: str
    pipeline_id: str
    name: str
    order: int
    probability: float | None


@dataclass
class CrmPipelineEntity:
    id: str
    name: str
    stages: list[CrmPipelineStageEntity] = field(default_factory=list)
