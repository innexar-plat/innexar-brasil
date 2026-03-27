from pydantic import BaseModel, EmailStr, Field


class StartCheckoutRequestDto(BaseModel):
    customer_email: EmailStr
    product_slug: str = Field(min_length=1, max_length=100)
    amount_cents: int = Field(ge=0)


class CheckoutDto(BaseModel):
    id: str
    customer_id: str
    product_slug: str
    amount_cents: int
    status: str
    payment_provider: str


class StartCheckoutResponseDto(BaseModel):
    data: CheckoutDto
