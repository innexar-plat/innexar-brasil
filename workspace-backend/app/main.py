from fastapi import FastAPI

from app.config import settings
from app.modules.analytics.routes import router as analytics_router
from app.modules.auth.routes import router as auth_router
from app.modules.audiences.routes import router as audiences_router
from app.modules.campaigns.routes import router as campaigns_router
from app.modules.customers.routes import router as customers_router
from app.modules.checkout.routes import router as checkout_router
from app.modules.invoices.routes import router as invoices_router
from app.modules.leads.routes import router as leads_router
from app.modules.payments.routes import router as payments_router
from app.modules.products.routes import router as products_router
from app.modules.subscriptions.routes import router as subscriptions_router
from app.modules.agent_config.routes import router as agent_config_router
from app.modules.agent_runs.routes import router as agent_runs_router
from app.modules.assistant.routes import router as assistant_router
from app.modules.channels.routes import router as channels_router
from app.modules.contacts.routes import router as contacts_router
from app.modules.crm.routes import router as crm_router
from app.modules.inbox.routes import router as inbox_router
from app.modules.performance.routes import router as performance_router
from app.modules.templates.routes import router as templates_router
from app.modules.tickets.routes import router as tickets_router

app = FastAPI(title=settings.app_name)


@app.get("/health", tags=["health"])
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(auth_router, prefix="/api/v1")
app.include_router(analytics_router, prefix="/api/v1")
app.include_router(audiences_router, prefix="/api/v1")
app.include_router(campaigns_router, prefix="/api/v1")
app.include_router(checkout_router, prefix="/api/v1")
app.include_router(customers_router, prefix="/api/v1")
app.include_router(invoices_router, prefix="/api/v1")
app.include_router(leads_router, prefix="/api/v1")
app.include_router(payments_router, prefix="/api/v1")
app.include_router(products_router, prefix="/api/v1")
app.include_router(agent_config_router, prefix="/api/v1")
app.include_router(agent_runs_router, prefix="/api/v1")
app.include_router(assistant_router, prefix="/api/v1")
app.include_router(channels_router, prefix="/api/v1")
app.include_router(contacts_router, prefix="/api/v1")
app.include_router(crm_router, prefix="/api/v1")
app.include_router(inbox_router, prefix="/api/v1")
app.include_router(performance_router, prefix="/api/v1")
app.include_router(subscriptions_router, prefix="/api/v1")
app.include_router(templates_router, prefix="/api/v1")
app.include_router(tickets_router, prefix="/api/v1")
