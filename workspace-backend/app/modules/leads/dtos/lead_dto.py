from pydantic import BaseModel, EmailStr, Field


class LeadDto(BaseModel):
    id: str
    email: EmailStr
    name: str = Field(min_length=1, max_length=255)
    source: str = Field(min_length=1, max_length=50)
    status: str = Field(min_length=1, max_length=30)


class CreateLeadDto(BaseModel):
    email: EmailStr
    name: str = Field(min_length=1, max_length=255)
    source: str = Field(min_length=1, max_length=50)
    status: str = Field(default="new", min_length=1, max_length=30)


class UpdateLeadDto(BaseModel):
    email: EmailStr | None = None
    name: str | None = Field(default=None, min_length=1, max_length=255)
    source: str | None = Field(default=None, min_length=1, max_length=50)
    status: str | None = Field(default=None, min_length=1, max_length=30)

