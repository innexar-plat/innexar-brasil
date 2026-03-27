from dataclasses import dataclass


@dataclass
class UserEntity:
    id: str
    email: str
    password_hash: str
    role: str
