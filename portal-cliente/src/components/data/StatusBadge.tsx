import { Badge } from '@/components/ui'
import type { BadgeProps } from '@/components/ui'
import type {
  InvoiceStatus,
  SubscriptionStatus,
  PaymentStatus,
  TicketStatus,
  TicketPriority,
} from '@/types'

// ─── Invoice Status ───────────────────────────────────────────────────────────
const INVOICE_BADGE: Record<InvoiceStatus, { variant: BadgeProps['variant']; label: string }> = {
  pending:   { variant: 'warning',  label: 'Pendente' },
  paid:      { variant: 'success',  label: 'Paga' },
  overdue:   { variant: 'danger',   label: 'Vencida' },
  cancelled: { variant: 'default',  label: 'Cancelada' },
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const { variant, label } = INVOICE_BADGE[status]
  return <Badge variant={variant} dot>{label}</Badge>
}

// ─── Subscription Status ──────────────────────────────────────────────────────
const SUBSCRIPTION_BADGE: Record<SubscriptionStatus, { variant: BadgeProps['variant']; label: string }> = {
  active:    { variant: 'success',  label: 'Ativa' },
  inactive:  { variant: 'default',  label: 'Inativa' },
  cancelled: { variant: 'danger',   label: 'Cancelada' },
  trial:     { variant: 'brand',    label: 'Trial' },
}

export function SubscriptionStatusBadge({ status }: { status: SubscriptionStatus }) {
  const { variant, label } = SUBSCRIPTION_BADGE[status]
  return <Badge variant={variant} dot>{label}</Badge>
}

// ─── Payment Status ───────────────────────────────────────────────────────────
const PAYMENT_BADGE: Record<PaymentStatus, { variant: BadgeProps['variant']; label: string }> = {
  pending:   { variant: 'warning', label: 'Pendente' },
  completed: { variant: 'success', label: 'Concluído' },
  failed:    { variant: 'danger',  label: 'Falhou' },
  refunded:  { variant: 'cyan',    label: 'Estornado' },
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const { variant, label } = PAYMENT_BADGE[status]
  return <Badge variant={variant} dot>{label}</Badge>
}

// ─── Ticket Status ────────────────────────────────────────────────────────────
const TICKET_BADGE: Record<TicketStatus, { variant: BadgeProps['variant']; label: string }> = {
  open:        { variant: 'brand',   label: 'Aberto' },
  in_progress: { variant: 'warning', label: 'Em andamento' },
  resolved:    { variant: 'success', label: 'Resolvido' },
  closed:      { variant: 'default', label: 'Fechado' },
}

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const { variant, label } = TICKET_BADGE[status]
  return <Badge variant={variant} dot>{label}</Badge>
}

// ─── Ticket Priority ──────────────────────────────────────────────────────────
const PRIORITY_BADGE: Record<TicketPriority, { variant: BadgeProps['variant']; label: string }> = {
  low:      { variant: 'default',  label: 'Baixa' },
  medium:   { variant: 'info',     label: 'Média' },
  high:     { variant: 'warning',  label: 'Alta' },
  critical: { variant: 'danger',   label: 'Crítica' },
}

export function TicketPriorityBadge({ priority }: { priority: TicketPriority }) {
  const { variant, label } = PRIORITY_BADGE[priority]
  return <Badge variant={variant}>{label}</Badge>
}
