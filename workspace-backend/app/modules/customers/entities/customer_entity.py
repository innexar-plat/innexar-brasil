from dataclasses import dataclass


@dataclass
class CustomerEntity:
    id: str
    email: str
    first_name: str
    last_name: str
    status: str
