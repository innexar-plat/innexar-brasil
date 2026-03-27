import { useEffect, useCallback } from 'react'
import { Megaphone } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { DataTable, CampaignStatusBadge } from '@/components/data'
import type { Column } from '@/components/data'
import { EmptyState } from '@/components/feedback'
import { useAsync } from '@/hooks/useAsync'
import { usePagination } from '@/hooks/usePagination'
import { campaignsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Campaign } from '@/types'

const TYPE_LABELS: Record<string, string> = {
  email: 'E-mail',
  whatsapp: 'WhatsApp',
  sms: 'SMS',
  push: 'Push',
}

const cols: Column<Campaign>[] = [
  { key: 'name', header: 'Nome', render: (r) => <span className="font-medium text-white">{r.name}</span> },
  { key: 'type', header: 'Canal', render: (r) => TYPE_LABELS[r.type] ?? r.type },
  { key: 'sent_count', header: 'Enviados', render: (r) => String(r.sent_count ?? '—') },
  { key: 'open_count', header: 'Abertos', render: (r) => String(r.open_count ?? '—') },
  { key: 'click_count', header: 'Cliques', render: (r) => String(r.click_count ?? '—') },
  { key: 'scheduled_at', header: 'Agendado', render: (r) => r.scheduled_at ? formatDate(r.scheduled_at) : '—' },
  { key: 'status', header: 'Status', render: (r) => <CampaignStatusBadge status={r.status} /> },
]

export default function CampanhasPage() {
  const pagination = usePagination()
  const { execute, data, isLoading } = useAsync(campaignsApi.list)

  const load = useCallback(
    () => execute({ page: pagination.page, limit: pagination.limit }),
    [pagination.page, pagination.limit],
  )

  useEffect(() => { load() }, [pagination.page])

  useEffect(() => {
    if (data?.meta.total !== undefined) {
      pagination.setTotal(data.meta.total, data.meta.totalPages)
    }
  }, [data?.meta])

  return (
    <PageWrapper>
      <PageHeader title="Campanhas" description="Gerencie suas campanhas de comunicação" />

      {!isLoading && data?.data.length === 0 ? (
        <EmptyState icon={<Megaphone className="size-8 text-slate-500" />} title="Nenhuma campanha" description="Crie sua primeira campanha para engajar clientes." />
      ) : (
        <DataTable<Campaign>
          title="Campanhas"
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
