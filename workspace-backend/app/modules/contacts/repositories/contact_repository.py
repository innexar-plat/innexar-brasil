from dataclasses import replace as dc_replace

from app.modules.contacts.entities.contact_entity import ContactEntity

_SEED: dict[str, ContactEntity] = {
    "c0000000-0000-0000-0000-000000000001": ContactEntity(
        id="c0000000-0000-0000-0000-000000000001",
        name="Maria Silva",
        email="maria.silva@innexar.com",
        phone="+55 11 91234-5678",
        status="active",
    )
}


class ContactRepository:
    def list_contacts(self) -> list[ContactEntity]:
        return list(_SEED.values())

    def get_contact(self, contact_id: str) -> ContactEntity | None:
        return _SEED.get(contact_id)

    def create_contact(self, entity: ContactEntity) -> ContactEntity:
        return entity

    def update_contact(self, contact_id: str, updates: dict[str, object]) -> ContactEntity | None:
        existing = _SEED.get(contact_id)
        if existing is None:
            return None
        return dc_replace(existing, **updates)

    def delete_contact(self, contact_id: str) -> bool:
        return contact_id in _SEED

