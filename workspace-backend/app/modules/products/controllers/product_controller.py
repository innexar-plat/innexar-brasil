from app.modules.products.dtos.product_dto import CreateProductDto, ProductDto, UpdateProductDto
from app.modules.products.repositories.product_repository import ProductRepository
from app.modules.products.services.product_service import ProductService


class ProductController:
    def __init__(self) -> None:
        repository = ProductRepository()
        self.service = ProductService(repository)

    def list_products(self) -> list[ProductDto]:
        return self.service.list_products()

    def get_product(self, product_id: str) -> ProductDto:
        return self.service.get_product(product_id)

    def create_product(self, dto: CreateProductDto) -> ProductDto:
        return self.service.create_product(dto)

    def update_product(self, product_id: str, dto: UpdateProductDto) -> ProductDto:
        return self.service.update_product(product_id, dto)

    def delete_product(self, product_id: str) -> None:
        return self.service.delete_product(product_id)

