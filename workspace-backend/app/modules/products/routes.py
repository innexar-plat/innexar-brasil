from fastapi import APIRouter, Depends, status

from app.core.auth_dependency import get_current_user
from app.modules.products.controllers.product_controller import ProductController
from app.modules.products.dtos.product_dto import CreateProductDto, ProductDto, UpdateProductDto

router = APIRouter(prefix="/products", tags=["products"])
controller = ProductController()


@router.get("", response_model=list[ProductDto], status_code=status.HTTP_200_OK)
def list_products(_: str = Depends(get_current_user)) -> list[ProductDto]:
    return controller.list_products()


@router.post("", response_model=ProductDto, status_code=status.HTTP_201_CREATED)
def create_product(
    payload: CreateProductDto, _: str = Depends(get_current_user)
) -> ProductDto:
    return controller.create_product(payload)


@router.get("/{product_id}", response_model=ProductDto, status_code=status.HTTP_200_OK)
def get_product(product_id: str, _: str = Depends(get_current_user)) -> ProductDto:
    return controller.get_product(product_id)


@router.patch("/{product_id}", response_model=ProductDto, status_code=status.HTTP_200_OK)
def update_product(
    product_id: str,
    payload: UpdateProductDto,
    _: str = Depends(get_current_user),
) -> ProductDto:
    return controller.update_product(product_id, payload)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: str, _: str = Depends(get_current_user)) -> None:
    controller.delete_product(product_id)

