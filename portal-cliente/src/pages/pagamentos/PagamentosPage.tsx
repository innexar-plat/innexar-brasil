import { useEffect } from 'react'
import { DollarSign } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { DataTable, PaymentStatusBadge } from '@/components/data'
import type { Column } from '@/components/data'
import { EmptyState } from '@/components/feedback'
import { useAsync } from '@/hooks/useAsync'
import { paymentsApi } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import type { Payment } from '@/types'

const cols: Column<Payment>[] = [
  {
    key: 'invoice_id',
    header: 'Fatura',
    render: (r) => <span className="font-mono text-xs text-slate-400">{r.invoice_id.slice(0, 8)}…</span>,
  },
  {
    key: 'provider',
    header: 'Provedor',
    render: (r) => <span className="capitalize">{r.provider}</span>,
  },
  {
    key: 'amount_cents',
    header: 'Valor',
    render: (r) => <span className="font-semibold">{formatCurrency(r.amount_cents / 100)}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    render: (r) => <PaymentStatusBadge status={r.status} />,
  },
]

export default function PagamentosPage() {
  const { execute, data, isLoading } = useAsync(paymentsApi.list)

  useEffect(() => {
    execute()
  }, [])

  return (
    <PageWrapper>
      <PageHeader title="Pagamentos" description="Histórico de transações financeiras" />

      {!isLoading && data?.length === 0 ? (
        <EmptyState
          icon={<DollarSign className="size-8 text-slate-500" />}
          title="Nenhum pagamento"
          description="Não há pagamentos registrados ainda."
        />
      ) : (
        <DataTable<Payment>
          title="Pagamentos"
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
