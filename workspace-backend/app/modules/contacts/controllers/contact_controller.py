from app.modules.contacts.dtos.contact_dto import ContactDto, CreateContactDto, UpdateContactDto
from app.modules.contacts.repositories.contact_repository import ContactRepository
from app.modules.contacts.services.contact_service import ContactService


class ContactController:
    def __init__(self) -> None:
        repository = ContactRepository()
        self.service = ContactService(repository)

    def list_contacts(self) -> list[ContactDto]:
        return self.service.list_contacts()

    def get_contact(self, contact_id: str) -> ContactDto:
        return self.service.get_contact(contact_id)

    def create_contact(self, dto: CreateContactDto) -> ContactDto:
        return self.service.create_contact(dto)

    def update_contact(self, contact_id: str, dto: UpdateContactDto) -> ContactDto:
        return self.service.update_contact(contact_id, dto)

    def delete_contact(self, contact_id: str) -> None:
        return self.service.delete_contact(contact_id)

