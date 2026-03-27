# Changelog

All notable changes to `workspace-backend` will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
Versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2026-03-27

### Added

- Full backend with 21 domain modules using Clean Architecture + DDD
- JWT Bearer authentication on all routes (except `POST /auth/login` and `GET /health`)
- 549 automated tests with 100% code coverage gate
- Ruff lint gate (0 errors) integrated into `make quality`

### Modules

| Module | Routes |
|--------|--------|
| Auth | POST /api/v1/auth/login |
| Analytics | POST, GET /api/v1/analytics/events; GET /api/v1/analytics/events/{id} |
| Audiences | Full CRUD /api/v1/audiences |
| Campaigns | Full CRUD /api/v1/campaigns |
| Channels | Full CRUD /api/v1/channels + sync-status + sync-jobs |
| Checkout | POST /api/v1/checkout/start; GET /api/v1/checkout/{id} |
| Contacts | Full CRUD /api/v1/contacts |
| CRM | Full CRUD for leads, deals; GET pipelines |
| Customers | POST, GET, PATCH /api/v1/customers |
| Inbox | POST, GET, PATCH /api/v1/inbox |
| Invoices | POST, GET, PATCH /api/v1/invoices |
| Leads | Full CRUD /api/v1/leads |
| Payments | POST, GET /api/v1/payments |
| Performance | GET metrics, coaching, reminders |
| Products | Full CRUD /api/v1/products |
| Subscriptions | Full CRUD /api/v1/subscriptions |
| Templates | Full CRUD /api/v1/templates |
| Tickets | POST, GET, PATCH /api/v1/tickets |
| Agent Config | Full CRUD + policy /api/v1/agent-config |
| Agent Runs | POST, GET, actions /api/v1/agent-runs |
| Assistant | Sessions CRUD + messages /api/v1/assistant/sessions |

### Quality

- Tests: 549 passing
- Coverage: 100%
- Lint: ruff 0.4.10 — 0 errors
- Build: compileall clean
