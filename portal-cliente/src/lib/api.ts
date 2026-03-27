import type { ApiError, Subscription, Invoice, Payment, Product, Ticket, CreateTicketPayload } from '@/types'

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

function getToken(): string | null {
  return localStorage.getItem('access_token')
}

function buildHeaders(extra?: Record<string, string>): HeadersInit {
  const token = getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  }
}

export class ApiClientError extends Error {
  constructor(
    public statusCode: number,
    public error: string,
    message: string,
    public details?: { field: string; message: string }[],
  ) {
    super(message)
    this.name = 'ApiClientError'
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: buildHeaders(init?.headers as Record<string, string>),
  })

  if (!res.ok) {
    let errorBody: ApiError
    try {
      errorBody = await res.json()
    } catch {
      errorBody = { statusCode: res.status, error: res.statusText, message: 'Erro desconhecido' }
    }
    throw new ApiClientError(errorBody.statusCode, errorBody.error, errorBody.message, errorBody.details)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    request<{ access_token: string; token_type: string }>('/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<{ id: string; email: string; name: string; role: string }>('/v1/auth/me'),
}

// ─── Subscriptions ───────────────────────────────────────────────────────────
export const subscriptionsApi = {
  list: () => request<Subscription[]>('/v1/subscriptions'),
  get: (id: string) => request<Subscription>(`/v1/subscriptions/${id}`),
}

// ─── Invoices ────────────────────────────────────────────────────────────────
export const invoicesApi = {
  list: () => request<Invoice[]>('/v1/invoices'),
  get: (id: string) => request<Invoice>(`/v1/invoices/${id}`),
}

// ─── Payments ────────────────────────────────────────────────────────────────
export const paymentsApi = {
  list: () => request<Payment[]>('/v1/payments'),
}

// ─── Products ────────────────────────────────────────────────────────────────
export const productsApi = {
  list: () => request<Product[]>('/v1/products'),
}

// ─── Tickets ─────────────────────────────────────────────────────────────────
export const ticketsApi = {
  list: () => request<Ticket[]>('/v1/tickets'),
  create: (payload: CreateTicketPayload) =>
    request<Ticket>('/v1/tickets', { method: 'POST', body: JSON.stringify(payload) }),
}
