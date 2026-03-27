from pydantic import BaseModel, Field


class CampaignDto(BaseModel):
    id: str
    name: str = Field(min_length=1, max_length=255)
    channel: str = Field(min_length=1, max_length=50)
    status: str = Field(min_length=1, max_length=30)


class CreateCampaignDto(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    channel: str = Field(min_length=1, max_length=50)
    status: str = Field(default="draft", min_length=1, max_length=30)


class UpdateCampaignDto(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    channel: str | None = Field(default=None, min_length=1, max_length=50)
    status: str | None = Field(default=None, min_length=1, max_length=30)

