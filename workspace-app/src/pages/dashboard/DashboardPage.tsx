import { useEffect } from 'react'
import { Users, TrendingUp, DollarSign, TicketCheck, MessageSquare, UserCircle } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { StatCard } from '@/components/data'
import { Spinner } from '@/components/feedback'
import { useAsync } from '@/hooks/useAsync'
import { analyticsApi } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

export default function DashboardPage() {
  const summary = useAsync(analyticsApi.summary)

  useEffect(() => {
    summary.execute()
  }, [])

  const d = summary.data

  return (
    <PageWrapper>
      <PageHeader title="Dashboard" description="Visão geral do seu negócio" />

      {summary.isLoading ? (
        <div className="flex justify-center py-24">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard index={0} icon={<DollarSign className="size-5" />} label="Receita Total" value={d ? formatCurrency(d.total_revenue) : '—'} accent="success" />
          <StatCard index={1} icon={<Users className="size-5" />} label="Clientes Ativos" value={d ? String(d.total_customers) : '—'} accent="brand" />
          <StatCard index={2} icon={<TrendingUp className="size-5" />} label="Assinaturas Ativas" value={d ? String(d.active_subscriptions) : '—'} accent="cyan" />
          <StatCard index={3} icon={<UserCircle className="size-5" />} label="Novos Leads" value={d ? String(d.new_leads) : '—'} accent="warning" />
          <StatCard index={4} icon={<TicketCheck className="size-5" />} label="Tickets Abertos" value={d ? String(d.open_tickets) : '—'} accent="danger" />
          <StatCard index={5} icon={<MessageSquare className="size-5" />} label="Taxa de Conversão" value={d ? `${d.conversion_rate.toFixed(1)}%` : '—'} accent="brand" />
        </div>
      )}
    </PageWrapper>
  )
}
