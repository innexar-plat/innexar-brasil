import { useEffect, useCallback } from 'react'
import { TicketCheck } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { DataTable, TicketStatusBadge, TicketPriorityBadge } from '@/components/data'
import type { Column } from '@/components/data'
import { EmptyState } from '@/components/feedback'
import { useAsync } from '@/hooks/useAsync'
import { usePagination } from '@/hooks/usePagination'
import { ticketsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Ticket } from '@/types'

const cols: Column<Ticket>[] = [
  { key: 'subject', header: 'Assunto', render: (r) => <span className="font-medium text-white">{r.subject}</span> },
  { key: 'customer', header: 'Cliente', render: (r) => r.customer?.name ?? '—' },
  { key: 'priority', header: 'Prioridade', render: (r) => <TicketPriorityBadge priority={r.priority} /> },
  { key: 'assigned_to', header: 'Atribuído a', render: (r) => r.assigned_to ?? '—' },
  { key: 'created_at', header: 'Criado em', render: (r) => formatDate(r.created_at) },
  { key: 'status', header: 'Status', render: (r) => <TicketStatusBadge status={r.status} /> },
]

export default function TicketsPage() {
  const pagination = usePagination()
  const { execute, data, isLoading } = useAsync(ticketsApi.list)

  const load = useCallback(() => execute({ page: pagination.page, limit: pagination.limit }), [pagination.page])

  useEffect(() => { load() }, [pagination.page])
  useEffect(() => { if (data?.meta.total !== undefined) pagination.setTotal(data.meta.total, data.meta.totalPages) }, [data?.meta.total])

  return (
    <PageWrapper>
      <PageHeader title="Tickets" description="Chamados de suporte e atendimento" />

      {!isLoading && data?.data.length === 0 ? (
        <EmptyState icon={<TicketCheck className="size-8 text-slate-500" />} title="Nenhum ticket" description="Não há tickets de suporte no momento." />
      ) : (
        <DataTable<Ticket>
          title="Tickets de Suporte"
          columns={cols}
          data={data?.data ?? []}
          isLoading={isLoading}
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          onPrev={pagination.prevPage}
          onNext={pagination.nextPage}
          canPrev={pagination.canPrev}
          canNext={pagination.canNext}
        />
      )}
    </PageWrapper>
  )
}
