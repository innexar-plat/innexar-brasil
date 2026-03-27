import { useEffect } from 'react'
import { CreditCard } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { DataTable, SubscriptionStatusBadge } from '@/components/data'
import type { Column } from '@/components/data'
import { EmptyState } from '@/components/feedback'
import { useAsync } from '@/hooks/useAsync'
import { subscriptionsApi } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import type { Subscription } from '@/types'

const cols: Column<Subscription>[] = [
  {
    key: 'product_slug',
    header: 'Produto',
    render: (r) => <span className="font-medium text-white">{r.product_slug}</span>,
  },
  {
    key: 'interval',
    header: 'Ciclo',
    render: (r) => (r.interval === 'month' ? 'Mensal' : 'Anual'),
  },
  {
    key: 'amount_cents',
    header: 'Valor',
    render: (r) => formatCurrency(r.amount_cents / 100),
  },
  {
    key: 'status',
    header: 'Status',
    render: (r) => <SubscriptionStatusBadge status={r.status} />,
  },
]

export default function AssinaturasPage() {
  const { execute, data, isLoading } = useAsync(subscriptionsApi.list)

  useEffect(() => {
    execute()
  }, [])

  return (
    <PageWrapper>
      <PageHeader title="Assinaturas" description="Seus planos ativos e histórico de assinaturas" />

      {!isLoading && data?.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="size-8 text-slate-500" />}
          title="Nenhuma assinatura"
          description="Você não possui assinaturas ativas no momento."
        />
      ) : (
        <DataTable<Subscription>
          title="Suas Assinaturas"
          columns={cols}
          data={data ?? []}
          isLoading={isLoading}
          page={1}
          totalPages={1}
          total={data?.length ?? 0}
        />
      )}
    </PageWrapper>
  )
}
