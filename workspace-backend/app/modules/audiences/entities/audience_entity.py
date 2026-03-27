from dataclasses import dataclass


@dataclass
class AudienceEntity:
    id: str
    name: str
    segment: str
    status: str
