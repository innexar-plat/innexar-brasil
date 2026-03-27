from pydantic import BaseModel, Field


class ProductDto(BaseModel):
    id: str
    slug: str = Field(min_length=1, max_length=100)
    name: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1, max_length=2000)
    price_cents: int = Field(ge=0)
    is_active: bool


class CreateProductDto(BaseModel):
    slug: str = Field(min_length=1, max_length=100)
    name: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1, max_length=2000)
    price_cents: int = Field(ge=0)
    is_active: bool = True


class UpdateProductDto(BaseModel):
    slug: str | None = Field(default=None, min_length=1, max_length=100)
    name: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = Field(default=None, min_length=1, max_length=2000)
    price_cents: int | None = Field(default=None, ge=0)
    is_active: bool | None = None
