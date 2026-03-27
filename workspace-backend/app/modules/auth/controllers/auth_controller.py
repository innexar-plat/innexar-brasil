from app.modules.auth.dtos.login_dto import LoginRequestDto, LoginResponseDto
from app.modules.auth.repositories.auth_repository import AuthRepository
from app.modules.auth.services.auth_service import AuthService


class AuthController:
    def __init__(self) -> None:
        repository = AuthRepository()
        self.service = AuthService(repository)

    def login(self, request: LoginRequestDto) -> LoginResponseDto:
        return self.service.login(request)
