from pydantic import BaseModel, Field


class TemplateDto(BaseModel):
    id: str
    name: str = Field(min_length=1, max_length=255)
    channel: str = Field(min_length=1, max_length=50)
    content: str = Field(min_length=1, max_length=4000)
    status: str = Field(min_length=1, max_length=30)

class CreateTemplateDto(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    channel: str = Field(min_length=1, max_length=50)
    content: str = Field(min_length=1, max_length=5000)
    status: str = Field(default="draft", min_length=1, max_length=30)


class UpdateTemplateDto(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    channel: str | None = Field(default=None, min_length=1, max_length=50)
    content: str | None = Field(default=None, min_length=1, max_length=5000)
    status: str | None = Field(default=None, min_length=1, max_length=30)
