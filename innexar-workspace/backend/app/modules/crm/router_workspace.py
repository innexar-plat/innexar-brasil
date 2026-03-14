"""Workspace CRM routes: contacts."""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.rbac import RequirePermission
from app.models.user import User
from app.modules.crm.models import Contact
from app.modules.crm.schemas import ContactCreate, ContactResponse, ContactUpdate

router = APIRouter(prefix="/crm", tags=["workspace-crm"])


@router.get("/contacts", response_model=list[ContactResponse])
async def list_contacts(
    db: Annotated[AsyncSession, Depends(get_db)],
    _: Annotated[User, Depends(RequirePermission("crm:read"))],
):
    """List contacts (workspace)."""
    r = await db.execute(select(Contact).order_by(Contact.id))
    return list(r.scalars().all())


@router.post("/contacts", response_model=ContactResponse, status_code=201)
async def create_contact(
    body: ContactCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
    _: Annotated[User, Depends(RequirePermission("crm:write"))],
):
    """Create contact."""
    c = Contact(
        name=body.name,
        email=body.email,
        phone=body.phone,
        customer_id=body.customer_id,
    )
    db.add(c)
    await db.flush()
    await db.refresh(c)
    return c


@router.get("/contacts/{contact_id}", response_model=ContactResponse)
async def get_contact(
    contact_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
    _: Annotated[User, Depends(RequirePermission("crm:read"))],
):
    """Get contact by id."""
    r = await db.execute(select(Contact).where(Contact.id == contact_id))
    c = r.scalar_one_or_none()
    if not c:
        raise HTTPException(status_code=404, detail="Contact not found")
    return c


@router.patch("/contacts/{contact_id}", response_model=ContactResponse)
async def update_contact(
    contact_id: int,
    body: ContactUpdate,
    db: Annotated[AsyncSession, Depends(get_db)],
    _: Annotated[User, Depends(RequirePermission("crm:write"))],
):
    """Update contact."""
    r = await db.execute(select(Contact).where(Contact.id == contact_id))
    c = r.scalar_one_or_none()
    if not c:
        raise HTTPException(status_code=404, detail="Contact not found")
    if body.name is not None:
        c.name = body.name
    if body.email is not None:
        c.email = body.email
    if body.phone is not None:
        c.phone = body.phone
    if body.customer_id is not None:
        c.customer_id = body.customer_id
    await db.flush()
    await db.refresh(c)
    return c


@router.delete("/contacts/{contact_id}", status_code=204)
async def delete_contact(
    contact_id: int,
    db: Annotated[AsyncSession, Depends(get_db)],
    _: Annotated[User, Depends(RequirePermission("crm:write"))],
):
    """Delete contact."""
    r = await db.execute(select(Contact).where(Contact.id == contact_id))
    c = r.scalar_one_or_none()
    if not c:
        raise HTTPException(status_code=404, detail="Contact not found")
    await db.delete(c)
    await db.flush()
