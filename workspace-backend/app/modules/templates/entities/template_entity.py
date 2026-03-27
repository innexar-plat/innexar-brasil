from dataclasses import dataclass


@dataclass
class TemplateEntity:
    id: str
    name: str
    channel: str
    content: str
    status: str
