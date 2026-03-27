from dataclasses import replace as dc_replace

from app.modules.products.entities.product_entity import ProductEntity

_SEED: dict[str, ProductEntity] = {
    "20000000-0000-0000-0000-000000000001": ProductEntity(
        id="20000000-0000-0000-0000-000000000001",
        slug="site-pro",
        name="Site Pro",
        description="Plano profissional para presenca digital",
        price_cents=19900,
        is_active=True,
    )
}


class ProductRepository:
    def list_products(self) -> list[ProductEntity]:
        return list(_SEED.values())

    def get_product(self, product_id: str) -> ProductEntity | None:
        return _SEED.get(product_id)

    def create_product(self, entity: ProductEntity) -> ProductEntity:
        return entity

    def update_product(
        self, product_id: str, updates: dict[str, object]
    ) -> ProductEntity | None:
        existing = _SEED.get(product_id)
        if existing is None:
            return None
        return dc_replace(existing, **updates)

    def delete_product(self, product_id: str) -> bool:
        return product_id in _SEED

