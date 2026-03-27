// ─── Auth ────────────────────────────────────────────────────────────────────
export interface AuthTokens {
  access_token: string
  token_type: string
}

export interface User {
  id: string
  email: string
  name: string
  role: string
  is_active: boolean
  created_at: string
}

// ─── Product ─────────────────────────────────────────────────────────────────
export interface Product {
  id: string
  slug: string
  name: string
  description: string
  price_cents: number
  is_active: boolean
}

// ─── Subscription ────────────────────────────────────────────────────────────
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'trial'
export type SubscriptionInterval = 'month' | 'year'

export interface Subscription {
  id: string
  customer_id: string
  product_slug: string
  status: SubscriptionStatus
  interval: SubscriptionInterval
  amount_cents: number
}

// ─── Invoice ─────────────────────────────────────────────────────────────────
export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'cancelled'

export interface Invoice {
  id: string
  subscription_id: string
  amount_cents: number
  currency: string
  status: InvoiceStatus
}

// ─── Payment ─────────────────────────────────────────────────────────────────
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface Payment {
  id: string
  invoice_id: string
  provider: string
  amount_cents: number
  status: PaymentStatus
}

// ─── Ticket ──────────────────────────────────────────────────────────────────
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical'

export interface Ticket {
  id: string
  customer_id: string
  title: string
  priority: TicketPriority
  status: TicketStatus
}

// ─── Customer ────────────────────────────────────────────────────────────────
export interface Customer {
  id: string
  name: string
  email: string
  phone: string | null
  document: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// ─── Errors ──────────────────────────────────────────────────────────────────
export interface ApiError {
  statusCode: number
  error: string
  message: string
  details?: { field: string; message: string }[]
}

export interface CreateTicketPayload {
  customer_id: string
  title: string
  priority: TicketPriority
  status: string
}
