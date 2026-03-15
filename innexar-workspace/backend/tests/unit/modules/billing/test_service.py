"""Unit tests for billing service (mocked provider)."""

import os
from datetime import UTC, datetime
from unittest.mock import MagicMock, patch

import pytest
from app.models.customer import Customer
from app.models.integration_config import IntegrationConfig
from app.modules.billing.enums import InvoiceStatus
from app.modules.billing.models import Invoice, PaymentAttempt, WebhookEvent
from app.modules.billing.service import (
    _get_payment_provider,
    create_manual_invoice,
    create_payment_attempt,
    process_webhook,
)
from app.providers.payments.base import PaymentLinkResult, WebhookResult
from app.providers.payments.mercadopago import MercadoPagoProvider
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


@pytest.mark.asyncio
async def test_create_payment_attempt_with_mock_provider(
    db_session: AsyncSession,
) -> None:
    """create_payment_attempt uses provider and persists PaymentAttempt and updates Invoice."""
    customer = Customer(org_id="test", name="C", email="c@test.com")
    db_session.add(customer)
    await db_session.flush()
    inv = await create_manual_invoice(
        db_session,
        customer_id=customer.id,
        due_date=datetime.now(UTC),
        total=100.0,
        currency="USD",
    )
    await db_session.flush()
    mock_result = PaymentLinkResult(
        payment_url="https://checkout.mock/pay", external_id="ch_mock_1"
    )
    mock_provider = MagicMock()
    mock_provider.create_payment_link.return_value = mock_result

    with patch(
        "app.modules.billing.service._get_payment_provider", return_value=mock_provider
    ):
        res = await create_payment_attempt(
            db_session,
            invoice_id=inv.id,
            success_url="https://example.com/ok",
            cancel_url="https://example.com/cancel",
            customer_email="c@test.com",
        )
    assert res.payment_url == "https://checkout.mock/pay"
    mock_provider.create_payment_link.assert_called_once()
    r = await db_session.execute(
        select(PaymentAttempt).where(PaymentAttempt.invoice_id == inv.id)
    )
    attempt = r.scalar_one_or_none()
    assert attempt is not None
    assert attempt.payment_url == "https://checkout.mock/pay"
    assert attempt.provider in ("stripe", "mercadopago")
    await db_session.refresh(inv)
    assert inv.status == InvoiceStatus.PENDING.value


@pytest.mark.asyncio
async def test_process_webhook_idempotent(db_session: AsyncSession) -> None:
    """Processing same Stripe event_id twice returns ok then already_processed without re-updating."""
    customer = Customer(org_id="test", name="C", email="c@test.com")
    db_session.add(customer)
    await db_session.flush()
    inv = Invoice(
        customer_id=customer.id,
        status=InvoiceStatus.PENDING.value,
        due_date=datetime.now(UTC),
        total=50.0,
        currency="USD",
    )
    db_session.add(inv)
    await db_session.flush()
    event_id = "ev_abc123"
    body = b'{"id":"' + event_id.encode() + b'"}'
    headers = {"stripe-signature": "mock"}

    mock_result = MagicMock()
    mock_result.processed = True
    mock_result.invoice_id = inv.id
    mock_result.message = event_id

    with patch("app.modules.billing.service.StripeProvider") as mock_stripe_class:
        mock_stripe_class.return_value.handle_webhook.return_value = mock_result
        ok1, msg1, _ = await process_webhook(db_session, "stripe", body, headers)
    assert ok1 is True
    assert msg1 == "ok"
    await db_session.refresh(inv)
    assert inv.status == InvoiceStatus.PAID.value
    assert inv.paid_at is not None

    # Second call: idempotent
    with patch("app.modules.billing.service.StripeProvider") as mock_stripe_class:
        mock_stripe_class.return_value.handle_webhook.return_value = mock_result
        ok2, msg2, _ = await process_webhook(db_session, "stripe", body, headers)
    assert ok2 is True
    assert msg2 == "already_processed"
    r = await db_session.execute(
        select(WebhookEvent).where(WebhookEvent.event_id == event_id)
    )
    events = list(r.scalars().all())
    assert len(events) == 1


@pytest.mark.asyncio
async def test_process_webhook_mercadopago_marks_invoice_paid(
    db_session: AsyncSession,
) -> None:
    """Processing Mercado Pago webhook with approved payment marks invoice PAID and is idempotent."""
    customer = Customer(org_id="test", name="C", email="c@test.com")
    db_session.add(customer)
    await db_session.flush()
    inv = Invoice(
        customer_id=customer.id,
        status=InvoiceStatus.PENDING.value,
        due_date=datetime.now(UTC),
        total=50.0,
        currency="BRL",
    )
    db_session.add(inv)
    await db_session.flush()
    payment_id = "pay_mp_123"
    body = b'{"type":"payment","data":{"id":"' + payment_id.encode() + b'"}}'
    headers: dict[str, str] = {}

    mock_result = WebhookResult(
        processed=True,
        invoice_id=inv.id,
        message=payment_id,
    )

    with patch("app.modules.billing.service.MercadoPagoProvider") as mock_mp_class:
        mock_mp_class.return_value.handle_webhook.return_value = mock_result
        ok1, msg1, paid_id = await process_webhook(
            db_session, "mercadopago", body, headers
        )
    assert ok1 is True
    assert msg1 == "ok"
    assert paid_id == inv.id
    await db_session.refresh(inv)
    assert inv.status == InvoiceStatus.PAID.value
    assert inv.paid_at is not None

    with patch("app.modules.billing.service.MercadoPagoProvider") as mock_mp_class:
        mock_mp_class.return_value.handle_webhook.return_value = mock_result
        ok2, msg2, _ = await process_webhook(db_session, "mercadopago", body, headers)
    assert ok2 is True
    assert msg2 == "already_processed"


@pytest.mark.asyncio
async def test_get_payment_provider_prefers_mp_access_token_env(
    db_session: AsyncSession,
) -> None:
    """With MP_ACCESS_TOKEN set, _get_payment_provider returns MercadoPagoProvider with that token (not IntegrationConfig)."""
    customer = Customer(org_id="innexar", name="C", email="c@test.com")
    db_session.add(customer)
    await db_session.flush()
    with patch.dict(os.environ, {"MP_ACCESS_TOKEN": "env-token-mp"}, clear=False):
        provider = await _get_payment_provider(
            db_session,
            customer_id=customer.id,
            org_id="innexar",
            currency="BRL",
            mode="test",
        )
    assert isinstance(provider, MercadoPagoProvider)
    assert provider._access_token == "env-token-mp"


@pytest.mark.asyncio
async def test_get_payment_provider_fallback_to_integration_config_when_no_env(
    db_session: AsyncSession,
) -> None:
    """Without MP_ACCESS_TOKEN, with IntegrationConfig global mercadopago/access_token, returns provider with token from config."""
    customer = Customer(org_id="innexar", name="C", email="c@test.com")
    db_session.add(customer)
    await db_session.flush()
    cfg = IntegrationConfig(
        scope="global",
        org_id="innexar",
        customer_id=None,
        provider="mercadopago",
        key="access_token",
        value_encrypted="encrypted_placeholder",
        enabled=True,
        mode="test",
    )
    db_session.add(cfg)
    await db_session.commit()

    with (
        patch.dict(
            os.environ,
            {"MP_ACCESS_TOKEN": "", "MERCADOPAGO_ACCESS_TOKEN": ""},
            clear=False,
        ),
        patch("app.modules.billing.service.decrypt_value", return_value="config-token"),
    ):
        provider = await _get_payment_provider(
            db_session,
            customer_id=customer.id,
            org_id="innexar",
            currency="BRL",
            mode="test",
        )
    assert isinstance(provider, MercadoPagoProvider)
    assert provider._access_token == "config-token"
