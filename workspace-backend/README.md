# Innexar Workspace Backend

Backend workspace skeleton following Clean Architecture + DDD:
- modules organized by domain
- layers separated by responsibility (controllers, services, repositories, entities, dtos)
- FastAPI + SQLAlchemy async

## Quality Rule (mandatory)

For every new module/service/repository/controller/entity/dto/route:
- Add tests in the same delivery.
- Add or update documentation in the same delivery.
- Minimum accepted coverage: 90% only for emergency exception.
- Required default target: 100% coverage.
- Run full gate before moving to the next step.

## Run

1. Create env and install dependencies:
   - pip install -r requirements.txt
2. Configure environment variables from .env.example
3. Start server:
   - uvicorn app.main:app --reload --port 8000

## Quality and build

- Install dependencies:
   - pip install -r requirements.txt
- Run tests with coverage gate:
   - make test
- Run quality suite (compile + tests):
   - make quality
- Run build validation:
   - make build

Only continue implementation if all commands pass without errors.

## Available routes

### Auth
- POST /api/v1/auth/login

### Analytics
- POST /api/v1/analytics/events
- GET /api/v1/analytics/events
- GET /api/v1/analytics/events/{event_id}

### Audiences
- GET /api/v1/audiences
- POST /api/v1/audiences
- GET /api/v1/audiences/{audience_id}
- PATCH /api/v1/audiences/{audience_id}
- DELETE /api/v1/audiences/{audience_id}

### Campaigns
- GET /api/v1/campaigns
- POST /api/v1/campaigns
- GET /api/v1/campaigns/{campaign_id}
- PATCH /api/v1/campaigns/{campaign_id}
- DELETE /api/v1/campaigns/{campaign_id}

### Channels
- GET /api/v1/channels
- POST /api/v1/channels
- GET /api/v1/channels/{account_id}
- PATCH /api/v1/channels/{account_id}
- DELETE /api/v1/channels/{account_id}
- GET /api/v1/channels/{account_id}/sync-status
- GET /api/v1/channels/{account_id}/sync-jobs

### Checkout
- POST /api/v1/checkout/start
- GET /api/v1/checkout/{checkout_id}

### Contacts
- GET /api/v1/contacts
- POST /api/v1/contacts
- GET /api/v1/contacts/{contact_id}
- PATCH /api/v1/contacts/{contact_id}
- DELETE /api/v1/contacts/{contact_id}

### CRM
- GET /api/v1/crm/leads
- POST /api/v1/crm/leads
- GET /api/v1/crm/leads/{lead_id}
- PATCH /api/v1/crm/leads/{lead_id}
- DELETE /api/v1/crm/leads/{lead_id}
- GET /api/v1/crm/deals
- POST /api/v1/crm/deals
- GET /api/v1/crm/deals/{deal_id}
- PATCH /api/v1/crm/deals/{deal_id}
- DELETE /api/v1/crm/deals/{deal_id}
- GET /api/v1/crm/pipelines
- GET /api/v1/crm/pipelines/{pipeline_id}

### Customers
- GET /api/v1/customers
- POST /api/v1/customers
- GET /api/v1/customers/{customer_id}
- PATCH /api/v1/customers/{customer_id}

### Inbox
- GET /api/v1/inbox
- POST /api/v1/inbox
- GET /api/v1/inbox/{message_id}
- PATCH /api/v1/inbox/{message_id}

### Invoices
- GET /api/v1/invoices
- POST /api/v1/invoices
- GET /api/v1/invoices/{invoice_id}
- PATCH /api/v1/invoices/{invoice_id}

### Leads
- GET /api/v1/leads
- POST /api/v1/leads
- GET /api/v1/leads/{lead_id}
- PATCH /api/v1/leads/{lead_id}
- DELETE /api/v1/leads/{lead_id}

### Payments
- GET /api/v1/payments
- POST /api/v1/payments
- GET /api/v1/payments/{payment_id}

### Performance
- GET /api/v1/performance/metrics
- GET /api/v1/performance/coaching
- GET /api/v1/performance/reminders

### Products
- GET /api/v1/products
- POST /api/v1/products
- GET /api/v1/products/{product_id}
- PATCH /api/v1/products/{product_id}
- DELETE /api/v1/products/{product_id}

### Subscriptions
- GET /api/v1/subscriptions
- POST /api/v1/subscriptions
- GET /api/v1/subscriptions/{subscription_id}
- PATCH /api/v1/subscriptions/{subscription_id}
- DELETE /api/v1/subscriptions/{subscription_id}

### Templates
- GET /api/v1/templates
- POST /api/v1/templates
- GET /api/v1/templates/{template_id}
- PATCH /api/v1/templates/{template_id}
- DELETE /api/v1/templates/{template_id}

### Tickets
- GET /api/v1/tickets
- POST /api/v1/tickets
- GET /api/v1/tickets/{ticket_id}
- PATCH /api/v1/tickets/{ticket_id}

### Agent Config
- GET /api/v1/agent-config
- POST /api/v1/agent-config
- GET /api/v1/agent-config/policy
- PATCH /api/v1/agent-config/policy
- GET /api/v1/agent-config/{config_id}
- PATCH /api/v1/agent-config/{config_id}
- DELETE /api/v1/agent-config/{config_id}

### Agent Runs
- GET /api/v1/agent-runs
- POST /api/v1/agent-runs
- GET /api/v1/agent-runs/{run_id}
- GET /api/v1/agent-runs/{run_id}/actions

### Assistant
- GET /api/v1/assistant/sessions
- POST /api/v1/assistant/sessions
- GET /api/v1/assistant/sessions/{session_id}
- DELETE /api/v1/assistant/sessions/{session_id}
- GET /api/v1/assistant/sessions/{session_id}/messages
- POST /api/v1/assistant/sessions/{session_id}/messages
- GET /api/v1/assistant/sessions/{session_id}
- GET /api/v1/assistant/sessions/{session_id}/messages
- GET /api/v1/crm/leads
- GET /api/v1/crm/leads/{lead_id}
- GET /api/v1/crm/deals
- GET /api/v1/crm/deals/{deal_id}
- GET /api/v1/crm/pipelines
- GET /api/v1/crm/pipelines/{pipeline_id}

## Current status

- Analytics module: implemented with tests.
- Audiences module: implemented with tests.
- Auth module: implemented with tests.
- Campaigns module: implemented with tests.
- Checkout module: implemented with tests.
- Contacts module: implemented with tests.
- Customers module: implemented with tests.
- Inbox module: implemented with tests.
- Invoices module: implemented with tests.
- Leads module: implemented with tests.
- Payments module: implemented with tests.
- Products module: implemented with tests.
- Subscriptions module: implemented with tests.
- Templates module: implemented with tests.
- Tickets module: implemented with tests.
- Performance module: implemented with tests.
- Channels module: implemented with tests.
- Agent Config module: implemented with tests.
- Agent Runs module: implemented with tests.
- Assistant module: implemented with tests.
- CRM module: implemented with tests.

**Total: 21 modules — 549 tests — 100% coverage.**

## Next step

- All 21 modules implemented with full CRUD + JWT protection, gate passing (549 tests, 100% coverage, ruff clean).
- Ready to wire up to the database layer (replace in-memory seeds with real SQLAlchemy queries) or extend with new domain modules.
