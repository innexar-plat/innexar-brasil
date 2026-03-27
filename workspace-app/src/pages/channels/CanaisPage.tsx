import { useEffect, useCallback } from 'react'
import { Radio } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { DataTable, ChannelStatusBadge } from '@/components/data'
import type { Column } from '@/components/data'
import { EmptyState } from '@/components/feedback'
import { Badge } from '@/components/ui'
import { useAsync } from '@/hooks/useAsync'
import { usePagination } from '@/hooks/usePagination'
import { channelsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Channel } from '@/types'

const TYPE_LABELS: Record<string, string> = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  facebook: 'Facebook',
  email: 'E-mail',
  sms: 'SMS',
  webchat: 'WebChat',
}

const cols: Column<Channel>[] = [
  { key: 'name', header: 'Nome', render: (r) => <span className="font-medium text-white">{r.name}</span> },
  { key: 'type', header: 'Tipo', render: (r) => <Badge variant="info" size="sm">{TYPE_LABELS[r.type] ?? r.type}</Badge> },
  { key: 'phone_number', header: 'Identificador', render: (r) => r.phone_number ?? r.username ?? '—' },
  { key: 'is_active', header: 'Ativo', render: (r) => <Badge variant={r.is_active ? 'success' : 'default'} dot size="sm">{r.is_active ? 'Sim' : 'Não'}</Badge> },
  { key: 'status', header: 'Status', render: (r) => <ChannelStatusBadge status={r.status} /> },
  { key: 'created_at', header: 'Criado em', render: (r) => formatDate(r.created_at) },
]

export default function CanaisPage() {
  const pagination = usePagination()
  const { execute, data, isLoading } = useAsync(channelsApi.list)

  const load = useCallback(() => execute({ page: pagination.page, limit: pagination.limit }), [pagination.page])

  useEffect(() => { load() }, [pagination.page])
  useEffect(() => { if (data?.meta.total !== undefined) pagination.setTotal(data.meta.total, data.meta.totalPages) }, [data?.meta.total])

  return (
    <PageWrapper>
      <PageHeader title="Canais" description="Canais de comunicação integrados" />

      {!isLoading && data?.data.length === 0 ? (
        <EmptyState icon={<Radio className="size-8 text-slate-500" />} title="Nenhum canal" description="Conecte um canal para começar a receber mensagens." />
      ) : (
        <DataTable<Channel>
          title="Canais"
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
