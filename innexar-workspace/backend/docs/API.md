# API – Contrato e comportamento

Documentação de contratos e comportamentos da API que afetam integrações ou uso externo. Detalhes completos estão em **OpenAPI**: `GET /docs` (Swagger UI) e `GET /redoc` (ReDoc).

**Integrações (provedores)**: requisitos, credenciais, webhooks e troubleshooting por provedor estão em [INTEGRATION_PROVIDERS.md](INTEGRATION_PROVIDERS.md) (Stripe, Mercado Pago, Hestia, SMTP, Cloudflare).

## Health check

- **GET /health** (público)
  - **200**: `{"status": "ok", "database": "ok"}` — aplicação e banco acessíveis.
  - **503**: Banco inacessível; corpo: `{"detail": "database unreachable"}`.
  - Uso típico: load balancer e healthchecks do container.

## Workspace – Config / Integrações

- **POST /api/workspace/config/integrations/{config_id}/test**
  - Testa a integração pelo `config_id` (Stripe, SMTP ou Mercado Pago).
  - Requer permissão `config:write`.
  - Resposta: `IntegrationTestResponse` — `ok: bool`; em sucesso `message` (ex.: `"Stripe connection OK"`); em falha `error` com a mensagem.
  - Em sucesso, o campo `last_tested_at` do config é atualizado.
  - Stripe: usa secret descriptografado e chama `Balance.retrieve()`.
  - SMTP: espera JSON no valor (host, port, user, password); testa conexão + STARTTLS + login.
  - Mercado Pago: retorna `ok: false` com mensagem de “test not implemented”.

## Workspace – Dashboard

- **GET /api/workspace/dashboard/revenue**
  - Query **period_type**: apenas `day`, `week` ou `month`. Qualquer outro valor gera **422 Unprocessable Entity**.

## Portal – Feature flags

As rotas do portal de **invoices**, **tickets** e **projects** dependem de feature flags. Se a flag estiver desligada, a rota responde **404** (“This feature is not enabled” ou “Billing is not enabled”).

- **Invoices** (`/api/portal/invoices/*`): habilitado se `billing.enabled` **ou** `portal.invoices.enabled` estiver ativo (alinhado a `GET /api/portal/me/features`).
- **Tickets** (`/api/portal/tickets/*`): flag `portal.tickets.enabled`.
- **Projects** (`/api/portal/projects/*`): flag `portal.projects.enabled`.

O frontend deve usar `GET /api/portal/me/features` para decidir o que exibir no menu; chamar uma rota com flag desligada resulta em 404.

## Workspace – Billing (admin)

- **PATCH /api/workspace/billing/subscriptions/{subscription_id}**: atualiza subscription (status, next_due_date, etc.). Body: `SubscriptionUpdate`. Requer permissão de billing. Ao alterar **status** para `suspended` ou `canceled`, o usuário Hestia vinculado (ProvisioningRecord) é suspenso; ao alterar para `active`, é reativado.
- **POST /api/workspace/billing/invoices/{invoice_id}/mark-paid**: marca fatura como paga (manual); ativa subscription e dispara provisionamento em background quando aplicável. Requer permissão de billing.
- **POST /api/workspace/billing/invoices/{id}/payment-link**: gera link de pagamento para a fatura (já existente).

## Workspace – Autenticação (staff)

- **POST /api/workspace/auth/staff/login**: body `{ "email", "password" }`. Retorna JWT para rotas `/api/workspace/*`.
- **GET /api/workspace/me**: perfil do staff logado (id, email, role, org_id). Requer Bearer (staff).
- **POST /api/workspace/auth/staff/forgot-password**: body `{ "email", "locale"? }`. Se existir conta, envia e-mail com link para `/{locale}/reset-password?token=...` na URL base de `WORKSPACE_URL` (fallback: `FRONTEND_URL`). Resposta sempre 200.
- **POST /api/workspace/auth/staff/reset-password**: body `{ "token", "new_password" }`. Redefine senha do staff; token válido por 24h.
- **PATCH /api/workspace/me/password**: body `{ "current_password", "new_password" }`. Altera senha do staff logado. Requer Bearer (staff).

## Workspace – Clientes

- **GET /api/workspace/customers**: lista clientes (Customer) com indicação de CustomerUser. Requer permissão (billing ou customers).
- **POST /api/workspace/customers**: cria cliente (nome, email, telefone, endereço opcional). Body: `CustomerCreate`. Retorna `CustomerResponse`.
- **POST /api/workspace/customers/{customer_id}/send-credentials**: cria ou atualiza CustomerUser com senha temporária e envia e-mail com URL do portal, login e senha (ou link para definir senha). Retorna `SendCredentialsResponse`.

## Portal – Autenticação (público e autenticado)

- **POST /api/public/auth/customer/forgot-password**: body `{ "email": "...", "locale"? }`. Gera token de recuperação, persiste e envia link por e-mail (ex.: `/{locale}/reset-password?token=...`) na URL base de `PORTAL_URL` (fallback: `FRONTEND_URL`). Resposta genérica (não revela se o e-mail existe).
- **POST /api/public/auth/customer/reset-password**: body `{ "token": "...", "new_password": "..." }`. Valida token, atualiza senha do CustomerUser e invalida o token.
- **PATCH /api/portal/me/password**: body `{ "current_password", "new_password" }`. Altera senha do cliente logado. Requer Bearer (cliente).

## Mercado Pago (BRL)

- **Pagamento**: para moeda BRL o provider usado é Mercado Pago (IntegrationConfig provider `mercadopago`, key `access_token`). O link de pagamento é uma **Preference** (Checkout Pro); `external_reference` = `invoice_id` para o webhook.
- **Webhook**: `POST /api/public/webhooks/mercadopago`. Configurar no app MP a URL de notificação (produção e teste). Opcional: variável `MP_NOTIFICATION_URL` ou `MERCADOPAGO_NOTIFICATION_URL` ao criar a preference. Ver [INTEGRATION_PROVIDERS.md](INTEGRATION_PROVIDERS.md).

## Hestia (hospedagem)

- **Conexão**: IntegrationConfig provider `hestia`, key `api_credentials`, value (JSON criptografado): `base_url`, `access_key`, `secret_key`. Teste: `POST /api/workspace/config/integrations/{id}/test`.
- **Configurações**: `GET/PUT /api/workspace/config/hestia/settings` (prazo de carência em dias, pacote padrão, auto-suspensão). Requer permissão `config:read` / `config:write`.
- **Inadimplência**: `POST /api/workspace/billing/process-overdue` (chamado por cron): suspende usuário no Hestia e marca subscription como SUSPENDED quando a fatura está vencida há mais de `grace_period_days` dias. Ver [INTEGRATION_PROVIDERS.md](INTEGRATION_PROVIDERS.md).

## Workspace – Hestia (gestão)

Endpoints de gestão do Hestia (usuários, domínios, pacotes). Requerem integração Hestia configurada em Config → Integrações; caso contrário retornam **503**. Permissões: `config:read` (leitura) e `config:write` (criação/edição/exclusão).

- **GET /api/workspace/hestia/overview**: `{ connected, total_users, error? }` — status da conexão e total de usuários.
- **GET /api/workspace/hestia/users**: lista usuários Hestia (array de objetos com pelo menos `name`).
- **POST /api/workspace/hestia/users**: cria usuário. Body: `user`, `password`, `email`, `package` (default `"default"`).
- **GET /api/workspace/hestia/users/{user}/domains**: lista domínios web do usuário.
- **POST /api/workspace/hestia/users/{user}/domains**: adiciona domínio. Body: `domain`, `ip?`, `aliases?` (default `"www"`).
- **GET /api/workspace/hestia/packages**: lista pacotes.
- **DELETE /api/workspace/hestia/users/{user}**: remove usuário.
- **DELETE /api/workspace/hestia/users/{user}/domains/{domain}**: remove domínio.
- **POST /api/workspace/hestia/users/{user}/suspend** e **POST /api/workspace/hestia/users/{user}/unsuspend**: suspender/reativar usuário.

## Portal do cliente – Faturas e pagamento

O fluxo de pagamento no portal usa **POST /api/portal/invoices/{invoice_id}/pay** com body `{ "success_url", "cancel_url" }`; a resposta traz `payment_url` para redirecionar o cliente ao gateway (Stripe/Mercado Pago). Este backend **não** expõe `GET .../payment-url`; o frontend deve usar sempre POST `pay` quando estiver conectado ao Workspace API.

- **GET /api/portal/invoices**: lista faturas do cliente. Requer Bearer (cliente) e billing habilitado.
- **GET /api/portal/invoices/{invoice_id}**: detalhe de uma fatura do cliente.
- **POST /api/portal/invoices/{invoice_id}/pay**: gera link de pagamento; body `PayRequest` (success_url, cancel_url). Retorna `PayResponse` (payment_url, attempt_id).
- **GET /api/portal/invoices/{invoice_id}/download**: retorna HTML para impressão da fatura (o cliente pode usar Ctrl+P e “Salvar como PDF” no navegador).

## Portal do cliente – Solicitação de projeto

- **POST /api/portal/new-project**: body `{ "project_name", "project_type", "description?", "budget?", "timeline?" }`. Cria registro em `project_requests` para o cliente logado. Requer Bearer (cliente). Retorna `{ "id", "message" }`.

## Portal do cliente (dashboard)

- **GET /api/portal/me/dashboard**: retorna `plan` (status, product_name, price_plan_name, since, **next_due_date**), `site` (url, status), `invoice` (última fatura: id, status, due_date, total, **payment_url** quando pendente e disponível), `can_pay_invoice`, `panel` (login, panel_url, password_hint), `support.tickets_open_count`, `messages.unread_count`. Autenticação: cliente do portal. Quando não há plano de hospedagem (subscription ou product sem provisioning), o frontend exibe apenas faturas e projetos (sem plan/site/panel).
