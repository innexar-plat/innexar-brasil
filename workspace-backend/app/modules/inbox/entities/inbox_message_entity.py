from dataclasses import dataclass


@dataclass
class InboxMessageEntity:
    id: str
    contact_id: str
    channel: str
    content: str
    status: str
