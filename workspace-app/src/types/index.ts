// ─── Auth ────────────────────────────────────────────────────────────────────
export interface AuthTokens {
  access_token: string
  token_type: string
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
  is_active: boolean
  created_at: string
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface ApiError {
  statusCode: number
  error: string
  message: string
  details?: { field: string; message: string }[]
}

// ─── Customers ────────────────────────────────────────────────────────────────
export interface Customer {
  id: string
  name?: string        // may be absent if backend returns first_name + last_name
  first_name?: string  // backend field
  last_name?: string   // backend field
  email: string
  phone?: string
  document?: string
  is_active?: boolean  // optional — backend returns status string
  status?: string      // backend field ('active' | 'inactive')
  created_at?: string
  updated_at?: string
}

// ─── Products ─────────────────────────────────────────────────────────────────
export interface Product {
  id: string
  name: string
  description?: string
  price: number
  currency: string
  billing_cycle?: 'monthly' | 'yearly' | 'one_time'
  is_active: boolean
  created_at: string
}

// ─── Subscriptions ────────────────────────────────────────────────────────────
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'past_due' | 'trialing'

export interface Subscription {
  id: string
  customer_id: string
  customer?: Customer
  product_id: string
  product?: Product
  plan_name: string
  status: SubscriptionStatus
  amount: number
  billing_cycle: 'monthly' | 'yearly'
  start_date: string
  end_date?: string
  next_billing_date?: string
  created_at: string
}

// ─── Invoices ─────────────────────────────────────────────────────────────────
export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled'

export interface Invoice {
  id: string
  customer_id: string
  customer?: Customer
  subscription_id?: string
  description: string
  amount: number
  currency: string
  status: InvoiceStatus
  issue_date: string
  due_date: string
  paid_at?: string
  created_at: string
}

// ─── Payments ─────────────────────────────────────────────────────────────────
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type PaymentMethod = 'credit_card' | 'boleto' | 'pix' | 'bank_transfer'

export interface Payment {
  id: string
  customer_id: string
  invoice_id?: string
  amount: number
  currency: string
  method: PaymentMethod
  status: PaymentStatus
  reference?: string
  paid_at?: string
  created_at: string
}

// ─── Tickets ──────────────────────────────────────────────────────────────────
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface Ticket {
  id: string
  customer_id?: string
  customer?: Customer
  title?: string       // backend field
  subject?: string     // legacy frontend field  
  message?: string
  status: TicketStatus
  priority: TicketPriority
  assigned_to?: string
  created_at?: string
  updated_at?: string
}

// ─── Leads ────────────────────────────────────────────────────────────────────
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  source?: string
  status: LeadStatus
  score?: number
  notes?: string
  assigned_to?: string
  created_at: string
  updated_at: string
}

// ─── Contacts ─────────────────────────────────────────────────────────────────
export interface Contact {
  id: string
  name: string
  email?: string
  phone?: string
  company?: string
  position?: string
  tags?: string[]
  is_active?: boolean  // optional — backend returns status string
  status?: string      // backend field
  created_at?: string
  updated_at?: string
}

// ─── CRM ──────────────────────────────────────────────────────────────────────
export type DealStatus = 'open' | 'won' | 'lost' | 'on_hold'

export interface Deal {
  id: string
  title: string
  value?: number
  stage_id?: string
  lead_id?: string
  closing_date?: string
  status: DealStatus
  created_at: string
}

// ─── Campaigns ────────────────────────────────────────────────────────────────
export type CampaignStatus = 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'cancelled'
export type CampaignType = 'email' | 'whatsapp' | 'sms' | 'push'

export interface Campaign {
  id: string
  name: string
  type?: CampaignType   // optional — backend returns channel string
  channel?: string      // backend field
  status: CampaignStatus
  subject?: string
  content?: string
  audience_id?: string
  scheduled_at?: string
  sent_count?: number
  open_count?: number
  click_count?: number
  created_at?: string
  updated_at?: string
}

// ─── Channels ─────────────────────────────────────────────────────────────────
export type ChannelType = 'whatsapp' | 'instagram' | 'facebook' | 'email' | 'sms' | 'webchat'
export type ChannelStatus = 'connected' | 'disconnected' | 'pending' | 'error'

export interface Channel {
  id: string
  name: string
  type: ChannelType
  status: ChannelStatus
  phone_number?: string
  username?: string
  is_active: boolean
  created_at: string
}

// ─── Inbox / Messages ─────────────────────────────────────────────────────────
export type MessageDirection = 'inbound' | 'outbound'
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed' | 'unread'

export interface InboxMessage {
  id: string
  contact_id: string
  channel: string
  content: string
  status: string
}

// ─── Templates ────────────────────────────────────────────────────────────────
export type TemplateCategory = 'marketing' | 'utility' | 'authentication'
export type TemplateStatus = 'pending' | 'approved' | 'rejected'

export interface Template {
  id: string
  name: string
  category?: TemplateCategory  // optional — not always returned by backend
  language?: string            // optional
  content: string
  status: TemplateStatus
  channel_type?: CampaignType  // optional — backend returns 'channel'
  channel?: string             // backend field
  variables?: string[]
  created_at?: string
  updated_at?: string
}

// ─── Agent Config ─────────────────────────────────────────────────────────────
export interface AgentConfig {
  id: string
  // Backend fields
  provider: string
  model_name?: string
  model?: string              // alias
  api_key_masked?: string
  temperature?: number
  max_tokens?: number
  active?: boolean            // backend boolean
  auto_reply_enabled?: boolean
  auto_classify_enabled?: boolean
  approval_required?: boolean
  autonomous_mode?: boolean
  system_prompt?: string
  max_cost_per_run_usd?: number
  daily_budget_usd?: number
  // Frontend compat
  name?: string
  description?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

// ─── Agent Runs ───────────────────────────────────────────────────────────────
export type AgentRunStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'

export interface AgentRun {
  id: string
  // Backend fields
  conversation_id?: string
  run_type?: string
  model_provider?: string
  model_name?: string
  tokens_in?: number
  tokens_out?: number
  cost_usd?: number
  latency_ms?: number
  // Frontend compat
  agent_config_id?: string
  agent?: AgentConfig
  input?: string
  output?: string
  tokens_used?: number
  duration_ms?: number
  status: AgentRunStatus
  created_at: string
  finished_at?: string
}

// ─── Analytics ────────────────────────────────────────────────────────────────
export interface AnalyticsSummary {
  total_revenue: number
  total_customers: number
  active_subscriptions: number
  open_tickets: number
  new_leads: number
  conversion_rate: number
  period: string
}

export interface AnalyticsDataPoint {
  date: string
  value: number
  label?: string
}

export interface AnalyticsChart {
  title: string
  data: AnalyticsDataPoint[]
}

// ─── Audiences ────────────────────────────────────────────────────────────────
export interface Audience {
  id: string
  name: string
  description?: string
  count?: number
  filters?: Record<string, unknown>
  created_at: string
}

// ─── Create Payloads ──────────────────────────────────────────────────────────
export interface CreateLeadPayload {
  name: string
  email: string
  phone?: string
  company?: string
  source?: string
  notes?: string
}

export interface CreateContactPayload {
  name: string
  email?: string
  phone?: string
  company?: string
  position?: string
}

export interface CreateCampaignPayload {
  name: string
  type: CampaignType
  subject?: string
  content: string
  audience_id?: string
  scheduled_at?: string
}

export interface CreateTicketPayload {
  customer_id?: string
  title?: string
  subject?: string
  message?: string
  priority: TicketPriority
}

export interface CreateTemplatePayload {
  name: string
  category: TemplateCategory
  language: string
  content: string
  channel_type: CampaignType
}
