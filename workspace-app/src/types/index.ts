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
  name: string
  email: string
  phone?: string
  document?: string
  is_active: boolean
  created_at: string
  updated_at: string
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
  subject: string
  message: string
  status: TicketStatus
  priority: TicketPriority
  assigned_to?: string
  created_at: string
  updated_at: string
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
  is_active: boolean
  created_at: string
  updated_at: string
}

// ─── CRM ──────────────────────────────────────────────────────────────────────
export type DealStatus = 'open' | 'won' | 'lost' | 'on_hold'

export interface Deal {
  id: string
  title: string
  value: number
  status: DealStatus
  customer_id?: string
  customer?: Customer
  lead_id?: string
  stage: string
  expected_close_date?: string
  notes?: string
  created_at: string
  updated_at: string
}

// ─── Campaigns ────────────────────────────────────────────────────────────────
export type CampaignStatus = 'draft' | 'scheduled' | 'running' | 'paused' | 'completed' | 'cancelled'
export type CampaignType = 'email' | 'whatsapp' | 'sms' | 'push'

export interface Campaign {
  id: string
  name: string
  type: CampaignType
  status: CampaignStatus
  subject?: string
  content: string
  audience_id?: string
  scheduled_at?: string
  sent_count?: number
  open_count?: number
  click_count?: number
  created_at: string
  updated_at: string
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
export type MessageStatus = 'sent' | 'delivered' | 'read' | 'failed'

export interface InboxMessage {
  id: string
  channel_id: string
  contact_id?: string
  contact?: Contact
  direction: MessageDirection
  content: string
  status: MessageStatus
  created_at: string
}

export interface Conversation {
  id: string
  channel_id: string
  contact_id?: string
  contact?: Contact
  last_message?: InboxMessage
  unread_count: number
  status: 'open' | 'closed' | 'pending'
  assigned_to?: string
  created_at: string
  updated_at: string
}

// ─── Templates ────────────────────────────────────────────────────────────────
export type TemplateCategory = 'marketing' | 'utility' | 'authentication'
export type TemplateStatus = 'pending' | 'approved' | 'rejected'

export interface Template {
  id: string
  name: string
  category: TemplateCategory
  language: string
  content: string
  status: TemplateStatus
  channel_type: CampaignType
  variables?: string[]
  created_at: string
  updated_at: string
}

// ─── Agent Config ─────────────────────────────────────────────────────────────
export interface AgentConfig {
  id: string
  name: string
  description?: string
  model: string
  provider: string
  system_prompt?: string
  temperature?: number
  max_tokens?: number
  is_active: boolean
  created_at: string
}

// ─── Agent Runs ───────────────────────────────────────────────────────────────
export type AgentRunStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled'

export interface AgentRun {
  id: string
  agent_config_id: string
  agent?: AgentConfig
  input: string
  output?: string
  status: AgentRunStatus
  tokens_used?: number
  duration_ms?: number
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
  subject: string
  message: string
  priority: TicketPriority
}

export interface CreateTemplatePayload {
  name: string
  category: TemplateCategory
  language: string
  content: string
  channel_type: CampaignType
}
