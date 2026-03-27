import { useEffect } from 'react'
import { FileText, Download } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { DataTable, InvoiceStatusBadge } from '@/components/data'
import type { Column } from '@/components/data'
import { Button } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { useAsync } from '@/hooks/useAsync'
import { invoicesApi } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import type { Invoice } from '@/types'

const cols: Column<Invoice>[] = [
  {
    key: 'subscription_id',
    header: 'Assinatura',
    render: (r) => <span className="font-mono text-xs text-slate-400">{r.subscription_id.slice(0, 8)}…</span>,
  },
  {
    key: 'amount_cents',
    header: 'Valor',
    render: (r) => <span className="font-semibold">{formatCurrency(r.amount_cents / 100)}</span>,
  },
  {
    key: 'currency',
    header: 'Moeda',
    render: (r) => r.currency,
  },
  {
    key: 'status',
    header: 'Status',
    render: (r) => <InvoiceStatusBadge status={r.status} />,
  },
  {
    key: 'id',
    header: '',
    render: () => (
      <Button variant="ghost" size="xs" leftIcon={<Download className="size-3.5" />}>
        PDF
      </Button>
    ),
  },
]

export default function FaturasPage() {
  const { execute, data, isLoading } = useAsync(invoicesApi.list)

  useEffect(() => {
    execute()
  }, [])

  return (
    <PageWrapper>
      <PageHeader title="Faturas" description="Histórico de faturas e cobranças" />

      {!isLoading && data?.length === 0 ? (
        <EmptyState
          icon={<FileText className="size-8 text-slate-500" />}
          title="Nenhuma fatura"
          description="Não há faturas registradas na sua conta."
        />
      ) : (
        <DataTable<Invoice>
          title="Faturas"
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
