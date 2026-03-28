import { useEffect } from 'react'
import { CreditCard, FileText, Package, Headset } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { StatCard, DataTable, InvoiceStatusBadge } from '@/components/data'
import type { Column } from '@/components/data'
import { Spinner } from '@/components/feedback'
import { useAsync } from '@/hooks/useAsync'
import { invoicesApi, subscriptionsApi } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import type { Invoice } from '@/types'

const invoiceCols: Column<Invoice>[] = [
  { key: 'subscription_id', header: 'Assinatura', render: (r) => <span className="font-mono text-xs text-slate-400">{r.subscription_id.slice(0, 8)}…</span> },
  { key: 'amount_cents', header: 'Valor', render: (r) => <span className="font-semibold">{formatCurrency(r.amount_cents / 100)}</span> },
  { key: 'currency', header: 'Moeda', render: (r) => r.currency },
  { key: 'status', header: 'Status', render: (r) => <InvoiceStatusBadge status={r.status} /> },
]

export default function DashboardPage() {
  const invoices = useAsync(invoicesApi.list)
  const subs = useAsync(subscriptionsApi.list)

  useEffect(() => {
    invoices.execute()
    subs.execute()
  }, [])

  const active = subs.data?.filter((s) => s.status === 'active').length ?? 0
  const pending = invoices.data?.filter((i) => i.status === 'pending').length ?? 0
  const totalDue = invoices.data
    ?.filter((i) => i.status === 'pending')
    .reduce((acc, i) => acc + i.amount_cents / 100, 0) ?? 0

  return (
    <PageWrapper>
      <PageHeader title="Dashboard" description="Resumo da sua conta" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard index={0} icon={<CreditCard className="size-5" />} label="Assinaturas Ativas" value={subs.isLoading ? '—' : String(active)} accent="brand" />
        <StatCard index={1} icon={<FileText className="size-5" />} label="Faturas Pendentes" value={invoices.isLoading ? '—' : String(pending)} accent="warning" />
        <StatCard index={2} icon={<Package className="size-5" />} label="Total a Pagar" value={invoices.isLoading ? '—' : formatCurrency(totalDue)} accent="danger" />
        <StatCard index={3} icon={<Headset className="size-5" />} label="Tickets Abertos" value="—" accent="cyan" />
      </div>

      {invoices.isLoading ? (
        <div className="flex justify-center py-12"><Spinner size="lg" /></div>
      ) : (
        <DataTable<Invoice>
          title="Faturas Recentes"
          columns={invoiceCols}
          data={(invoices.data ?? []).slice(0, 5)}
          isLoading={invoices.isLoading}
          page={1}
          totalPages={1}
          total={(invoices.data ?? []).length}
        />
      )}
    </PageWrapper>
  )
}
