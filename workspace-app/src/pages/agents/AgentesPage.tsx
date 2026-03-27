import { useEffect, useCallback } from 'react'
import { Bot } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { DataTable, AgentRunStatusBadge } from '@/components/data'
import type { Column } from '@/components/data'
import { Badge } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { useAsync } from '@/hooks/useAsync'
import { usePagination } from '@/hooks/usePagination'
import { agentRunsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { AgentRun } from '@/types'

const cols: Column<AgentRun>[] = [
  { key: 'id', header: 'ID', render: (r) => <span className="font-mono text-xs text-slate-400">{r.id.slice(0, 8)}</span> },
  { key: 'agent', header: 'Agente', render: (r) => <span className="font-medium text-white">{r.agent?.name ?? r.agent_config_id.slice(0, 8)}</span> },
  { key: 'input', header: 'Input', render: (r) => <span className="max-w-[200px] overflow-hidden truncate text-sm">{r.input}</span> },
  { key: 'tokens_used', header: 'Tokens', render: (r) => r.tokens_used ? <Badge variant="info" size="sm">{r.tokens_used}</Badge> : '—' },
  { key: 'duration_ms', header: 'Duração', render: (r) => r.duration_ms ? `${(r.duration_ms / 1000).toFixed(1)}s` : '—' },
  { key: 'status', header: 'Status', render: (r) => <AgentRunStatusBadge status={r.status} /> },
  { key: 'created_at', header: 'Criado em', render: (r) => formatDate(r.created_at) },
]

export default function AgentesPage() {
  const pagination = usePagination()
  const { execute, data, isLoading } = useAsync(agentRunsApi.list)

  const load = useCallback(() => execute({ page: pagination.page, limit: pagination.limit }), [pagination.page])

  useEffect(() => { load() }, [pagination.page])
  useEffect(() => { if (data?.meta.total !== undefined) pagination.setTotal(data.meta.total, data.meta.totalPages) }, [data?.meta.total])

  return (
    <PageWrapper>
      <PageHeader title="Agentes IA" description="Execuções de agentes de inteligência artificial" />

      {!isLoading && data?.data.length === 0 ? (
        <EmptyState icon={<Bot className="size-8 text-slate-500" />} title="Nenhuma execução" description="Nenhum agente foi executado ainda." />
      ) : (
        <DataTable<AgentRun>
          title="Execuções de Agentes"
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
