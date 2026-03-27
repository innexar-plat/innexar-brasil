import { Badge } from '@/components/ui'
import type { BadgeProps } from '@/components/ui'
import type {
  InvoiceStatus,
  SubscriptionStatus,
  PaymentStatus,
  TicketStatus,
  TicketPriority,
  LeadStatus,
  CampaignStatus,
  ChannelStatus,
  AgentRunStatus,
  TemplateStatus,
} from '@/types'

// ─── Invoice Status ───────────────────────────────────────────────────────────
const INVOICE_BADGE: Record<InvoiceStatus, { variant: BadgeProps['variant']; label: string }> = {
  draft:     { variant: 'default',  label: 'Rascunho' },
  pending:   { variant: 'warning',  label: 'Pendente' },
  paid:      { variant: 'success',  label: 'Paga' },
  overdue:   { variant: 'danger',   label: 'Vencida' },
  cancelled: { variant: 'default',  label: 'Cancelada' },
}
export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const cfg = INVOICE_BADGE[status]
  if (!cfg) return <Badge variant="default" dot>{String(status)}</Badge>
  return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>
}

// ─── Subscription Status ──────────────────────────────────────────────────────
const SUBSCRIPTION_BADGE: Record<SubscriptionStatus, { variant: BadgeProps['variant']; label: string }> = {
  active:   { variant: 'success', label: 'Ativa' },
  inactive: { variant: 'default', label: 'Inativa' },
  cancelled: { variant: 'danger', label: 'Cancelada' },
  past_due: { variant: 'warning', label: 'Em atraso' },
  trialing: { variant: 'brand',   label: 'Trial' },
}
export function SubscriptionStatusBadge({ status }: { status: SubscriptionStatus }) {
  const cfg = SUBSCRIPTION_BADGE[status]
  if (!cfg) return <Badge variant="default" dot>{String(status)}</Badge>
  return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>
}

// ─── Payment Status ───────────────────────────────────────────────────────────
const PAYMENT_BADGE: Record<PaymentStatus, { variant: BadgeProps['variant']; label: string }> = {
  pending:   { variant: 'warning', label: 'Pendente' },
  completed: { variant: 'success', label: 'Concluído' },
  failed:    { variant: 'danger',  label: 'Falhou' },
  refunded:  { variant: 'cyan',    label: 'Estornado' },
}
export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const cfg = PAYMENT_BADGE[status]
  if (!cfg) return <Badge variant="default" dot>{String(status)}</Badge>
  return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>
}

// ─── Ticket Status ────────────────────────────────────────────────────────────
const TICKET_BADGE: Record<TicketStatus, { variant: BadgeProps['variant']; label: string }> = {
  open:        { variant: 'brand',   label: 'Aberto' },
  in_progress: { variant: 'warning', label: 'Em andamento' },
  resolved:    { variant: 'success', label: 'Resolvido' },
  closed:      { variant: 'default', label: 'Fechado' },
}
export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const cfg = TICKET_BADGE[status]
  if (!cfg) return <Badge variant="default" dot>{String(status)}</Badge>
  return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>
}

// ─── Ticket Priority ──────────────────────────────────────────────────────────
const PRIORITY_BADGE: Record<TicketPriority, { variant: BadgeProps['variant']; label: string }> = {
  low:    { variant: 'default', label: 'Baixa' },
  medium: { variant: 'info',    label: 'Média' },
  high:   { variant: 'warning', label: 'Alta' },
  urgent: { variant: 'danger',  label: 'Urgente' },
}
export function TicketPriorityBadge({ priority }: { priority: TicketPriority }) {
  const cfg = PRIORITY_BADGE[priority]
  if (!cfg) return <Badge variant="default">{String(priority)}</Badge>
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}

// ─── Lead Status ──────────────────────────────────────────────────────────────
const LEAD_BADGE: Record<LeadStatus, { variant: BadgeProps['variant']; label: string }> = {
  new:       { variant: 'info',    label: 'Novo' },
  contacted: { variant: 'brand',   label: 'Contactado' },
  qualified: { variant: 'warning', label: 'Qualificado' },
  proposal:  { variant: 'purple',  label: 'Proposta' },
  won:       { variant: 'success', label: 'Ganho' },
  lost:      { variant: 'danger',  label: 'Perdido' },
}
export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const cfg = LEAD_BADGE[status]
  if (!cfg) return <Badge variant="default" dot>{String(status)}</Badge>
  return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>
}

// ─── Campaign Status ──────────────────────────────────────────────────────────
const CAMPAIGN_BADGE: Record<CampaignStatus, { variant: BadgeProps['variant']; label: string }> = {
  draft:     { variant: 'default', label: 'Rascunho' },
  scheduled: { variant: 'info',    label: 'Agendada' },
  running:   { variant: 'brand',   label: 'Em execução' },
  paused:    { variant: 'warning', label: 'Pausada' },
  completed: { variant: 'success', label: 'Concluída' },
  cancelled: { variant: 'danger',  label: 'Cancelada' },
}
export function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const cfg = CAMPAIGN_BADGE[status]
  if (!cfg) return <Badge variant="default" dot>{String(status)}</Badge>
  return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>
}

// ─── Channel Status ───────────────────────────────────────────────────────────
const CHANNEL_BADGE: Record<ChannelStatus, { variant: BadgeProps['variant']; label: string }> = {
  connected:    { variant: 'success', label: 'Conectado' },
  disconnected: { variant: 'default', label: 'Desconectado' },
  pending:      { variant: 'warning', label: 'Pendente' },
  error:        { variant: 'danger',  label: 'Erro' },
}
export function ChannelStatusBadge({ status }: { status: ChannelStatus }) {
  const cfg = CHANNEL_BADGE[status]
  if (!cfg) return <Badge variant="default" dot>{String(status)}</Badge>
  return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>
}

// ─── Agent Run Status ─────────────────────────────────────────────────────────
const AGENT_RUN_BADGE: Record<AgentRunStatus, { variant: BadgeProps['variant']; label: string }> = {
  queued:    { variant: 'default', label: 'Na fila' },
  running:   { variant: 'brand',   label: 'Executando' },
  completed: { variant: 'success', label: 'Concluído' },
  failed:    { variant: 'danger',  label: 'Falhou' },
  cancelled: { variant: 'default', label: 'Cancelado' },
}
export function AgentRunStatusBadge({ status }: { status: AgentRunStatus }) {
  const cfg = AGENT_RUN_BADGE[status]
  if (!cfg) return <Badge variant="default" dot>{String(status)}</Badge>
  return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>
}

// ─── Template Status ──────────────────────────────────────────────────────────
const TEMPLATE_BADGE: Record<TemplateStatus, { variant: BadgeProps['variant']; label: string }> = {
  pending:  { variant: 'warning', label: 'Pendente' },
  approved: { variant: 'success', label: 'Aprovado' },
  rejected: { variant: 'danger',  label: 'Rejeitado' },
}
export function TemplateStatusBadge({ status }: { status: TemplateStatus }) {
  const cfg = TEMPLATE_BADGE[status]
  if (!cfg) return <Badge variant="default" dot>{String(status)}</Badge>
  return <Badge variant={cfg.variant} dot>{cfg.label}</Badge>
}
