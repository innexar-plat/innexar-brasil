import pytest
from fastapi import HTTPException
from fastapi.testclient import TestClient

from app.modules.products.controllers.product_controller import ProductController
from app.modules.products.dtos.product_dto import CreateProductDto, ProductDto, UpdateProductDto
from app.modules.products.entities.product_entity import ProductEntity
from app.modules.products.repositories.product_repository import ProductRepository
from app.modules.products.services.product_service import ProductService

SEED_ID = "20000000-0000-0000-0000-000000000001"


def test_product_repository_list() -> None:
    repo = ProductRepository()
    items = repo.list_products()
    assert len(items) == 1
    assert isinstance(items[0], ProductEntity)
    assert items[0].slug == "site-pro"


def test_product_repository_get_found() -> None:
    repo = ProductRepository()
    item = repo.get_product(SEED_ID)
    assert item is not None
    assert item.name == "Site Pro"


def test_product_repository_get_not_found() -> None:
    repo = ProductRepository()
    assert repo.get_product("unknown") is None


def test_product_repository_create() -> None:
    repo = ProductRepository()
    entity = ProductEntity(
        id="new-id", slug="new-prod", name="New Product",
        description="Desc", price_cents=10000, is_active=True,
    )
    result = repo.create_product(entity)
    assert result.id == "new-id"


def test_product_repository_update_found() -> None:
    repo = ProductRepository()
    result = repo.update_product(SEED_ID, {"name": "Updated"})
    assert result is not None
    assert result.name == "Updated"


def test_product_repository_update_not_found() -> None:
    repo = ProductRepository()
    assert repo.update_product("unknown", {"name": "X"}) is None


def test_product_repository_delete_found() -> None:
    repo = ProductRepository()
    assert repo.delete_product(SEED_ID) is True


def test_product_repository_delete_not_found() -> None:
    repo = ProductRepository()
    assert repo.delete_product("unknown") is False


def test_product_service_list() -> None:
    service = ProductService(ProductRepository())
    items = service.list_products()
    assert len(items) == 1
    assert isinstance(items[0], ProductDto)
    assert items[0].price_cents == 19900


def test_product_service_get_found() -> None:
    service = ProductService(ProductRepository())
    item = service.get_product(SEED_ID)
    assert item.id == SEED_ID


def test_product_service_get_not_found() -> None:
    service = ProductService(ProductRepository())
    with pytest.raises(HTTPException) as err:
        service.get_product("unknown")
    assert err.value.status_code == 404


def test_product_service_create() -> None:
    service = ProductService(ProductRepository())
    dto = CreateProductDto(slug="new-prod", name="New Product", description="Desc", price_cents=10000)
    result = service.create_product(dto)
    assert isinstance(result, ProductDto)


def test_product_service_update_found() -> None:
    service = ProductService(ProductRepository())
    result = service.update_product(SEED_ID, UpdateProductDto(name="Updated"))
    assert result.name == "Updated"


def test_product_service_update_not_found() -> None:
    service = ProductService(ProductRepository())
    with pytest.raises(HTTPException) as err:
        service.update_product("unknown", UpdateProductDto(name="X"))
    assert err.value.status_code == 404


def test_product_service_delete_not_found() -> None:
    service = ProductService(ProductRepository())
    with pytest.raises(HTTPException) as err:
        service.delete_product("unknown")
    assert err.value.status_code == 404


def test_product_controller_list() -> None:
    controller = ProductController()
    items = controller.list_products()
    assert len(items) == 1
    assert items[0].name == "Site Pro"


def test_product_controller_get() -> None:
    controller = ProductController()
    item = controller.get_product(SEED_ID)
    assert item.slug == "site-pro"


def test_product_controller_create() -> None:
    controller = ProductController()
    dto = CreateProductDto(slug="new-prod", name="New Product", description="Desc", price_cents=10000)
    result = controller.create_product(dto)
    assert isinstance(result, ProductDto)


def test_product_controller_delete() -> None:
    controller = ProductController()
    controller.delete_product(SEED_ID)  # Should not raise


def test_product_route_list(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/products", headers=auth_headers)
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["id"] == SEED_ID


def test_product_route_list_unauthenticated(client: TestClient) -> None:
    response = client.get("/api/v1/products")
    assert response.status_code == 403


def test_product_route_create(client: TestClient, auth_headers: dict) -> None:
    payload = {"slug": "new-prod", "name": "New Product", "description": "Desc", "price_cents": 10000}
    response = client.post("/api/v1/products", json=payload, headers=auth_headers)
    assert response.status_code == 201
    assert response.json()["slug"] == "new-prod"


def test_product_route_get_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get(f"/api/v1/products/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 200


def test_product_route_get_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.get("/api/v1/products/unknown", headers=auth_headers)
    assert response.status_code == 404


def test_product_route_update_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch(f"/api/v1/products/{SEED_ID}", json={"name": "Updated"}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["name"] == "Updated"


def test_product_route_update_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.patch("/api/v1/products/unknown", json={"name": "X"}, headers=auth_headers)
    assert response.status_code == 404


def test_product_route_delete_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete(f"/api/v1/products/{SEED_ID}", headers=auth_headers)
    assert response.status_code == 204


def test_product_route_delete_not_found(client: TestClient, auth_headers: dict) -> None:
    response = client.delete("/api/v1/products/unknown", headers=auth_headers)
    assert response.status_code == 404
