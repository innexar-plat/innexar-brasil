from pydantic import BaseModel, Field


class ContactDto(BaseModel):
    id: str
    name: str = Field(min_length=1, max_length=255)
    email: str = Field(min_length=1, max_length=255)
    phone: str = Field(min_length=1, max_length=30)
    status: str = Field(min_length=1, max_length=30)


class CreateContactDto(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    email: str = Field(min_length=1, max_length=255)
    phone: str = Field(min_length=1, max_length=30)
    status: str = Field(default="active", min_length=1, max_length=30)


class UpdateContactDto(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=255)
    email: str | None = Field(default=None, min_length=1, max_length=255)
    phone: str | None = Field(default=None, min_length=1, max_length=30)
    status: str | None = Field(default=None, min_length=1, max_length=30)

