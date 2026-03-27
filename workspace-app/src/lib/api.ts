import type {
  AuthTokens,
  AuthUser,
  PaginatedResponse,
  Customer,
  Product,
  Subscription,
  Invoice,
  Payment,
  Ticket,
  Lead,
  Contact,
  Deal,
  Campaign,
  Channel,
  Conversation,
  Template,
  AgentConfig,
  AgentRun,
  AnalyticsSummary,
  AnalyticsChart,
  Audience,
  CreateLeadPayload,
  CreateContactPayload,
  CreateCampaignPayload,
  CreateTicketPayload,
  CreateTemplatePayload,
} from '@/types'

// ─── Error Class ─────────────────────────────────────────────────────────────
export class ApiClientError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly error: string,
    message: string,
    public readonly details?: { field: string; message: string }[],
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

// ─── Base Request ─────────────────────────────────────────────────────────────
interface RequestOptions {
  method?: string
  body?: unknown
  token?: string | null
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`/api/v1${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new ApiClientError(
      res.status,
      data.error ?? 'Error',
      data.message ?? `HTTP ${res.status}`,
      data.details,
    )
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

function getToken(): string | null {
  return localStorage.getItem('ws_access_token')
}

function authed<T>(path: string, options: Omit<RequestOptions, 'token'> = {}): Promise<T> {
  return request<T>(path, { ...options, token: getToken() })
}

// ─── Pagination Query ─────────────────────────────────────────────────────────
function paginationQuery(params: { page?: number; limit?: number; search?: string } = {}): string {
  const q = new URLSearchParams()
  if (params.page) q.set('page', String(params.page))
  if (params.limit) q.set('limit', String(params.limit))
  if (params.search) q.set('search', params.search)
  const str = q.toString()
  return str ? `?${str}` : ''
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    request<AuthTokens>('/auth/login', { method: 'POST', body: { email, password } }),
  me: () => authed<AuthUser>('/auth/me'),
}

// ─── Customers ────────────────────────────────────────────────────────────────
export const customersApi = {
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    authed<PaginatedResponse<Customer>>(`/customers${paginationQuery(params)}`),
  get: (id: string) => authed<Customer>(`/customers/${id}`),
  create: (data: Partial<Customer>) =>
    authed<Customer>('/customers', { method: 'POST', body: data }),
  update: (id: string, data: Partial<Customer>) =>
    authed<Customer>(`/customers/${id}`, { method: 'PATCH', body: data }),
  delete: (id: string) => authed<void>(`/customers/${id}`, { method: 'DELETE' }),
}

// ─── Products ─────────────────────────────────────────────────────────────────
export const productsApi = {
  list: (params?: { page?: number; limit?: number }) =>
    authed<PaginatedResponse<Product>>(`/products${paginationQuery(params)}`),
  get: (id: string) => authed<Product>(`/products/${id}`),
}

// ─── Subscriptions ────────────────────────────────────────────────────────────
export const subscriptionsApi = {
  list: (params?: { page?: number; limit?: number }) =>
    authed<PaginatedResponse<Subscription>>(`/subscriptions${paginationQuery(params)}`),
  get: (id: string) => authed<Subscription>(`/subscriptions/${id}`),
}

// ─── Invoices ─────────────────────────────────────────────────────────────────
export const invoicesApi = {
  list: (params?: { page?: number; limit?: number }) =>
    authed<PaginatedResponse<Invoice>>(`/invoices${paginationQuery(params)}`),
  get: (id: string) => authed<Invoice>(`/invoices/${id}`),
}

// ─── Payments ─────────────────────────────────────────────────────────────────
export const paymentsApi = {
  list: (params?: { page?: number; limit?: number }) =>
    authed<PaginatedResponse<Payment>>(`/payments${paginationQuery(params)}`),
}

// ─── Tickets ──────────────────────────────────────────────────────────────────
export const ticketsApi = {
  list: (params?: { page?: number; limit?: number }) =>
    authed<PaginatedResponse<Ticket>>(`/tickets${paginationQuery(params)}`),
  get: (id: string) => authed<Ticket>(`/tickets/${id}`),
  create: (data: CreateTicketPayload) =>
    authed<Ticket>('/tickets', { method: 'POST', body: data }),
  update: (id: string, data: Partial<Ticket>) =>
    authed<Ticket>(`/tickets/${id}`, { method: 'PATCH', body: data }),
}

// ─── Leads ────────────────────────────────────────────────────────────────────
export const leadsApi = {
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    authed<PaginatedResponse<Lead>>(`/leads${paginationQuery(params)}`),
  get: (id: string) => authed<Lead>(`/leads/${id}`),
  create: (data: CreateLeadPayload) =>
    authed<Lead>('/leads', { method: 'POST', body: data }),
  update: (id: string, data: Partial<Lead>) =>
    authed<Lead>(`/leads/${id}`, { method: 'PATCH', body: data }),
  delete: (id: string) => authed<void>(`/leads/${id}`, { method: 'DELETE' }),
}

// ─── Contacts ─────────────────────────────────────────────────────────────────
export const contactsApi = {
  list: (params?: { page?: number; limit?: number; search?: string }) =>
    authed<PaginatedResponse<Contact>>(`/contacts${paginationQuery(params)}`),
  get: (id: string) => authed<Contact>(`/contacts/${id}`),
  create: (data: CreateContactPayload) =>
    authed<Contact>('/contacts', { method: 'POST', body: data }),
  update: (id: string, data: Partial<Contact>) =>
    authed<Contact>(`/contacts/${id}`, { method: 'PATCH', body: data }),
  delete: (id: string) => authed<void>(`/contacts/${id}`, { method: 'DELETE' }),
}

// ─── CRM / Deals ──────────────────────────────────────────────────────────────
export const crmApi = {
  list: (params?: { page?: number; limit?: number }) =>
    authed<PaginatedResponse<Deal>>(`/crm${paginationQuery(params)}`),
  get: (id: string) => authed<Deal>(`/crm/${id}`),
  create: (data: Partial<Deal>) =>
    authed<Deal>('/crm', { method: 'POST', body: data }),
  update: (id: string, data: Partial<Deal>) =>
    authed<Deal>(`/crm/${id}`, { method: 'PATCH', body: data }),
  delete: (id: string) => authed<void>(`/crm/${id}`, { method: 'DELETE' }),
}

// ─── Campaigns ────────────────────────────────────────────────────────────────
export const campaignsApi = {
  list: (params?: { page?: number; limit?: number }) =>
    authed<PaginatedResponse<Campaign>>(`/campaigns${paginationQuery(params)}`),
  get: (id: string) => authed<Campaign>(`/campaigns/${id}`),
  create: (data: CreateCampaignPayload) =>
    authed<Campaign>('/campaigns', { method: 'POST', body: data }),
  update: (id: string, data: Partial<Campaign>) =>
    authed<Campaign>(`/campaigns/${id}`, { method: 'PATCH', body: data }),
  delete: (id: string) => authed<void>(`/campaigns/${id}`, { method: 'DELETE' }),
}

// ─── Channels ─────────────────────────────────────────────────────────────────
export const channelsApi = {
  list: (params?: { page?: number; limit?: number }) =>
    authed<PaginatedResponse<Channel>>(`/channels${paginationQuery(params)}`),
  get: (id: string) => authed<Channel>(`/channels/${id}`),
}

// ─── Inbox ────────────────────────────────────────────────────────────────────
export const inboxApi = {
  conversations: (params?: { page?: number; limit?: number }) =>
    authed<PaginatedResponse<Conversation>>(`/inbox${paginationQuery(params)}`),
  messages: (conversationId: string) =>
    authed<{ data: import('@/types').InboxMessage[] }>(`/inbox/${conversationId}/messages`),
  send: (conversationId: string, content: string) =>
    authed<import('@/types').InboxMessage>(`/inbox/${conversationId}/messages`, {
      method: 'POST',
      body: { content },
    }),
}

// ─── Templates ────────────────────────────────────────────────────────────────
export const templatesApi = {
  list: (params?: { page?: number; limit?: number }) =>
    authed<PaginatedResponse<Template>>(`/templates${paginationQuery(params)}`),
  get: (id: string) => authed<Template>(`/templates/${id}`),
  create: (data: CreateTemplatePayload) =>
    authed<Template>('/templates', { method: 'POST', body: data }),
  update: (id: string, data: Partial<Template>) =>
    authed<Template>(`/templates/${id}`, { method: 'PATCH', body: data }),
  delete: (id: string) => authed<void>(`/templates/${id}`, { method: 'DELETE' }),
}

// ─── Agent Config ─────────────────────────────────────────────────────────────
export const agentConfigApi = {
  list: (params?: { page?: number; limit?: number }) =>
    authed<PaginatedResponse<AgentConfig>>(`/agent-config${paginationQuery(params)}`),
  get: (id: string) => authed<AgentConfig>(`/agent-config/${id}`),
  create: (data: Partial<AgentConfig>) =>
    authed<AgentConfig>('/agent-config', { method: 'POST', body: data }),
  update: (id: string, data: Partial<AgentConfig>) =>
    authed<AgentConfig>(`/agent-config/${id}`, { method: 'PATCH', body: data }),
}

// ─── Agent Runs ───────────────────────────────────────────────────────────────
export const agentRunsApi = {
  list: (params?: { page?: number; limit?: number }) =>
    authed<PaginatedResponse<AgentRun>>(`/agent-runs${paginationQuery(params)}`),
  get: (id: string) => authed<AgentRun>(`/agent-runs/${id}`),
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export const analyticsApi = {
  summary: (period?: string) =>
    authed<AnalyticsSummary>(`/analytics/summary${period ? `?period=${period}` : ''}`),
  revenue: (period?: string) =>
    authed<AnalyticsChart>(`/analytics/revenue${period ? `?period=${period}` : ''}`),
  leads: (period?: string) =>
    authed<AnalyticsChart>(`/analytics/leads${period ? `?period=${period}` : ''}`),
}

// ─── Audiences ────────────────────────────────────────────────────────────────
export const audiencesApi = {
  list: (params?: { page?: number; limit?: number }) =>
    authed<PaginatedResponse<Audience>>(`/audiences${paginationQuery(params)}`),
  get: (id: string) => authed<Audience>(`/audiences/${id}`),
  create: (data: Partial<Audience>) =>
    authed<Audience>('/audiences', { method: 'POST', body: data }),
}
