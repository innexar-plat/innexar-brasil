from dataclasses import dataclass


@dataclass
class TicketEntity:
    id: str
    customer_id: str
    title: str
    priority: str
    status: str
