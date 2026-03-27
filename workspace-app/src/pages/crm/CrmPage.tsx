import { useEffect, useCallback } from 'react'
import { TrendingUp } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { DataTable } from '@/components/data'
import type { Column } from '@/components/data'
import { EmptyState } from '@/components/feedback'
import { Badge } from '@/components/ui'
import { useAsync } from '@/hooks/useAsync'
import { usePagination } from '@/hooks/usePagination'
import { crmApi } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Deal } from '@/types'

const STAGE_LABELS: Record<string, string> = {
  prospecting: 'Prospecção',
  qualification: 'Qualificação',
  proposal: 'Proposta',
  negotiation: 'Negociação',
  closed_won: 'Fechado (Ganho)',
  closed_lost: 'Fechado (Perdido)',
}

const STATUS_VARIANTS = {
  open: 'brand',
  won: 'success',
  lost: 'danger',
  on_hold: 'warning',
} as const

const cols: Column<Deal>[] = [
  { key: 'title', header: 'Negócio', render: (r) => <span className="font-medium text-white">{r.title}</span> },
  { key: 'value', header: 'Valor', render: (r) => formatCurrency(r.value) },
  { key: 'stage', header: 'Etapa', render: (r) => STAGE_LABELS[r.stage] ?? r.stage },
  {
    key: 'status',
    header: 'Status',
    render: (r) => (
      <Badge variant={STATUS_VARIANTS[r.status] ?? 'default'} dot size="sm">
        {r.status === 'open' ? 'Aberto' : r.status === 'won' ? 'Ganho' : r.status === 'lost' ? 'Perdido' : 'Em Espera'}
      </Badge>
    ),
  },
  { key: 'expected_close_date', header: 'Previsão Fechamento', render: (r) => r.expected_close_date ? formatDate(r.expected_close_date) : '—' },
  { key: 'created_at', header: 'Criado em', render: (r) => formatDate(r.created_at) },
]

export default function CrmPage() {
  const pagination = usePagination()
  const { execute, data, isLoading } = useAsync(crmApi.list)

  const load = useCallback(() => execute({ page: pagination.page, limit: pagination.limit }), [pagination.page])

  useEffect(() => { load() }, [pagination.page])
  useEffect(() => { if (data?.meta.total !== undefined) pagination.setTotal(data.meta.total, data.meta.totalPages) }, [data?.meta.total])

  return (
    <PageWrapper>
      <PageHeader title="CRM" description="Pipeline de negócios e oportunidades" />

      {!isLoading && data?.data.length === 0 ? (
        <EmptyState icon={<TrendingUp className="size-8 text-slate-500" />} title="Nenhum negócio" description="Comece adicionando negócios ao seu pipeline." />
      ) : (
        <DataTable<Deal>
          title="Negócios"
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
