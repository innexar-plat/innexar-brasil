from pydantic import BaseModel, Field


class PaymentDto(BaseModel):
    id: str
    invoice_id: str
    provider: str = Field(min_length=1, max_length=50)
    amount_cents: int = Field(ge=0)
    status: str = Field(min_length=1, max_length=30)


class CreatePaymentDto(BaseModel):
    invoice_id: str
    provider: str = Field(min_length=1, max_length=50)
    amount_cents: int = Field(ge=0)
    status: str = Field(default="pending", min_length=1, max_length=30)

