from fastapi import APIRouter, status

from app.modules.auth.controllers.auth_controller import AuthController
from app.modules.auth.dtos.login_dto import LoginRequestDto, LoginResponseDto

router = APIRouter(prefix="/auth", tags=["auth"])
controller = AuthController()


@router.post("/login", response_model=LoginResponseDto, status_code=status.HTTP_200_OK)
def login(payload: LoginRequestDto) -> LoginResponseDto:
    return controller.login(payload)
