from dataclasses import dataclass


@dataclass
class ProductEntity:
    id: str
    slug: str
    name: str
    description: str
    price_cents: int
    is_active: bool
