from pydantic import BaseModel, Field


class SubscriptionDto(BaseModel):
    id: str
    customer_id: str
    product_slug: str = Field(min_length=1, max_length=100)
    status: str = Field(min_length=1, max_length=30)
    interval: str = Field(pattern="^(month|year)$")
    amount_cents: int = Field(ge=0)


class CreateSubscriptionDto(BaseModel):
    customer_id: str
    product_slug: str = Field(min_length=1, max_length=100)
    status: str = Field(default="active", min_length=1, max_length=30)
    interval: str = Field(default="month", pattern="^(month|year)$")
    amount_cents: int = Field(ge=0)


class UpdateSubscriptionDto(BaseModel):
    status: str | None = Field(default=None, min_length=1, max_length=30)
    interval: str | None = Field(default=None, pattern="^(month|year)$")
    amount_cents: int | None = Field(default=None, ge=0)
