from pydantic import BaseModel, Field


class InvoiceDto(BaseModel):
    id: str
    subscription_id: str
    amount_cents: int = Field(ge=0)
    currency: str = Field(min_length=3, max_length=3)
    status: str = Field(min_length=1, max_length=30)

class CreateInvoiceDto(BaseModel):
    subscription_id: str
    amount_cents: int = Field(ge=0)
    currency: str = Field(default="BRL", min_length=1, max_length=10)
    status: str = Field(default="pending", min_length=1, max_length=30)


class UpdateInvoiceDto(BaseModel):
    amount_cents: int | None = Field(default=None, ge=0)
    currency: str | None = Field(default=None, min_length=1, max_length=10)
    status: str | None = Field(default=None, min_length=1, max_length=30)
