import uuid

from app.core.errors import not_found
from app.modules.contacts.dtos.contact_dto import ContactDto, CreateContactDto, UpdateContactDto
from app.modules.contacts.entities.contact_entity import ContactEntity
from app.modules.contacts.repositories.contact_repository import ContactRepository


class ContactService:
    def __init__(self, repository: ContactRepository) -> None:
        self.repository = repository

    def _to_dto(self, item: ContactEntity) -> ContactDto:
        return ContactDto(
            id=item.id,
            name=item.name,
            email=item.email,
            phone=item.phone,
            status=item.status,
        )

    def list_contacts(self) -> list[ContactDto]:
        return [self._to_dto(item) for item in self.repository.list_contacts()]

    def get_contact(self, contact_id: str) -> ContactDto:
        contact = self.repository.get_contact(contact_id)
        if contact is None:
            raise not_found("Contact not found")
        return self._to_dto(contact)

    def create_contact(self, dto: CreateContactDto) -> ContactDto:
        entity = ContactEntity(
            id=str(uuid.uuid4()),
            name=dto.name,
            email=dto.email,
            phone=dto.phone,
            status=dto.status,
        )
        return self._to_dto(self.repository.create_contact(entity))

    def update_contact(self, contact_id: str, dto: UpdateContactDto) -> ContactDto:
        updates = {k: v for k, v in dto.model_dump().items() if v is not None}
        entity = self.repository.update_contact(contact_id, updates)
        if entity is None:
            raise not_found("Contact not found")
        return self._to_dto(entity)

    def delete_contact(self, contact_id: str) -> None:
        if not self.repository.delete_contact(contact_id):
            raise not_found("Contact not found")

