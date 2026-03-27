from dataclasses import dataclass


@dataclass
class CampaignEntity:
    id: str
    name: str
    channel: str
    status: str
