from dataclasses import dataclass


@dataclass
class LeadEntity:
    id: str
    email: str
    name: str
    source: str
    status: str
