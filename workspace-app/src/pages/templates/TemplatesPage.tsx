import { useEffect, useCallback } from 'react'
import { FileText } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { DataTable, TemplateStatusBadge } from '@/components/data'
import type { Column } from '@/components/data'
import { Badge } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { useAsync } from '@/hooks/useAsync'
import { usePagination } from '@/hooks/usePagination'
import { templatesApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Template } from '@/types'

const CATEGORY_LABELS: Record<string, string> = {
  marketing: 'Marketing',
  utility: 'Utilitário',
  authentication: 'Autenticação',
}

const cols: Column<Template>[] = [
  { key: 'name', header: 'Nome', render: (r) => <span className="font-medium text-white">{r.name}</span> },
  { key: 'category', header: 'Categoria', render: (r) => CATEGORY_LABELS[r.category] ?? r.category },
  { key: 'channel_type', header: 'Canal', render: (r) => <Badge variant="info" size="sm">{r.channel_type}</Badge> },
  { key: 'language', header: 'Idioma', render: (r) => r.language },
  { key: 'status', header: 'Status', render: (r) => <TemplateStatusBadge status={r.status} /> },
  { key: 'created_at', header: 'Criado em', render: (r) => formatDate(r.created_at) },
]

export default function TemplatesPage() {
  const pagination = usePagination()
  const { execute, data, isLoading } = useAsync(templatesApi.list)

  const load = useCallback(() => execute({ page: pagination.page, limit: pagination.limit }), [pagination.page])

  useEffect(() => { load() }, [pagination.page])
  useEffect(() => { if (data?.meta.total !== undefined) pagination.setTotal(data.meta.total, data.meta.totalPages) }, [data?.meta.total])

  return (
    <PageWrapper>
      <PageHeader title="Templates" description="Modelos de mensagem para campanhas e automações" />

      {!isLoading && data?.data.length === 0 ? (
        <EmptyState icon={<FileText className="size-8 text-slate-500" />} title="Nenhum template" description="Crie modelos de mensagem reutilizáveis." />
      ) : (
        <DataTable<Template>
          title="Templates"
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
