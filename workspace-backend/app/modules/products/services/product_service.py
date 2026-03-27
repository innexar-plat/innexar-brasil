import uuid

from app.core.errors import not_found
from app.modules.products.dtos.product_dto import CreateProductDto, ProductDto, UpdateProductDto
from app.modules.products.entities.product_entity import ProductEntity
from app.modules.products.repositories.product_repository import ProductRepository


class ProductService:
    def __init__(self, repository: ProductRepository) -> None:
        self.repository = repository

    def _to_dto(self, item: ProductEntity) -> ProductDto:
        return ProductDto(
            id=item.id,
            slug=item.slug,
            name=item.name,
            description=item.description,
            price_cents=item.price_cents,
            is_active=item.is_active,
        )

    def list_products(self) -> list[ProductDto]:
        return [self._to_dto(item) for item in self.repository.list_products()]

    def get_product(self, product_id: str) -> ProductDto:
        entity = self.repository.get_product(product_id)
        if entity is None:
            raise not_found("Product not found")
        return self._to_dto(entity)

    def create_product(self, dto: CreateProductDto) -> ProductDto:
        entity = ProductEntity(
            id=str(uuid.uuid4()),
            slug=dto.slug,
            name=dto.name,
            description=dto.description,
            price_cents=dto.price_cents,
            is_active=dto.is_active,
        )
        return self._to_dto(self.repository.create_product(entity))

    def update_product(self, product_id: str, dto: UpdateProductDto) -> ProductDto:
        updates = {k: v for k, v in dto.model_dump().items() if v is not None}
        entity = self.repository.update_product(product_id, updates)
        if entity is None:
            raise not_found("Product not found")
        return self._to_dto(entity)

    def delete_product(self, product_id: str) -> None:
        if not self.repository.delete_product(product_id):
            raise not_found("Product not found")

