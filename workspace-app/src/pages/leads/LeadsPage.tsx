import { useEffect, useCallback } from 'react'
import { UserCircle } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { DataTable, LeadStatusBadge } from '@/components/data'
import type { Column } from '@/components/data'
import { EmptyState } from '@/components/feedback'
import { useAsync } from '@/hooks/useAsync'
import { usePagination } from '@/hooks/usePagination'
import { leadsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Lead } from '@/types'

const cols: Column<Lead>[] = [
  { key: 'name', header: 'Nome', render: (r) => <span className="font-medium text-white">{r.name}</span> },
  { key: 'email', header: 'E-mail', render: (r) => r.email },
  { key: 'company', header: 'Empresa', render: (r) => r.company ?? '—' },
  { key: 'source', header: 'Origem', render: (r) => r.source ?? '—' },
  { key: 'score', header: 'Score', render: (r) => r.score !== undefined ? <span className="font-mono">{r.score}</span> : '—' },
  { key: 'status', header: 'Status', render: (r) => <LeadStatusBadge status={r.status} /> },
  { key: 'created_at', header: 'Criado em', render: (r) => formatDate(r.created_at) },
]

export default function LeadsPage() {
  const pagination = usePagination()
  const { execute, data, isLoading } = useAsync(leadsApi.list)

  const load = useCallback(() => execute({ page: pagination.page, limit: pagination.limit }), [pagination.page])

  useEffect(() => { load() }, [pagination.page])
  useEffect(() => { if (data?.meta.total !== undefined) pagination.setTotal(data.meta.total, data.meta.totalPages) }, [data?.meta.total])

  return (
    <PageWrapper>
      <PageHeader title="Leads" description="Gerencie seus leads e prospects" />

      {!isLoading && data?.data.length === 0 ? (
        <EmptyState icon={<UserCircle className="size-8 text-slate-500" />} title="Nenhum lead" description="Adicione leads para começar a prospectar." />
      ) : (
        <DataTable<Lead>
          title="Leads"
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
