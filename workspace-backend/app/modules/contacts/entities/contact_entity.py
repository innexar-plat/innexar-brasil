from dataclasses import dataclass


@dataclass
class ContactEntity:
    id: str
    name: str
    email: str
    phone: str
    status: str
