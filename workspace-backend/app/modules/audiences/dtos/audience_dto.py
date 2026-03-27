from pydantic import BaseModel, Field


class AudienceDto(BaseModel):
    id: str
    name: str = Field(min_length=1, max_length=255)
    segment: str = Field(min_length=1, max_length=100)
    status: str = Field(min_length=1, max_length=30)


class CreateAudienceDto(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    segment: str = Field(min_length=1, max_length=100)
    status: str = Field(default="active", min_length=1, max_length=30)


class UpdateAudienceDto(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    segment: str | None = Field(default=None, min_length=1, max_length=100)
    status: str | None = Field(default=None, min_length=1, max_length=30)

