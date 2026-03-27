import { useEffect, useCallback } from 'react'
import { Bot, Cpu, Clock, DollarSign } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { DataTable, AgentRunStatusBadge } from '@/components/data'
import type { Column } from '@/components/data'
import { Badge, Card, CardHeader } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { useAsync } from '@/hooks/useAsync'
import { usePagination } from '@/hooks/usePagination'
import { agentRunsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { AgentRun } from '@/types'

const RUN_TYPE_LABELS: Record<string, string> = {
  auto_reply: 'Resposta Auto',
  manual: 'Manual',
  scheduled: 'Agendado',
  webhook: 'Webhook',
}

const cols: Column<AgentRun>[] = [
  {
    key: 'id',
    header: 'ID',
    render: (r) => <span className="font-mono text-xs text-slate-400">{r.id ? r.id.slice(0, 8) : '—'}</span>,
  },
  {
    key: 'run_type',
    header: 'Tipo',
    render: (r) => (
      <Badge variant="info" size="sm">
        {RUN_TYPE_LABELS[r.run_type ?? ''] ?? r.run_type ?? '—'}
      </Badge>
    ),
  },
  {
    key: 'model_name',
    header: 'Modelo',
    render: (r) => (
      <div className="flex items-center gap-1.5">
        <Cpu className="size-3.5 text-brand-400" />
        <span className="text-xs">{r.model_name ?? '—'}</span>
      </div>
    ),
  },
  {
    key: 'tokens_in',
    header: 'Tokens',
    render: (r) => {
      const total = (r.tokens_in ?? 0) + (r.tokens_out ?? r.tokens_used ?? 0)
      return total > 0 ? <Badge variant="info" size="sm">{total.toLocaleString()}</Badge> : '—'
    },
  },
  {
    key: 'latency_ms',
    header: 'Latência',
    render: (r) => {
      const ms = r.latency_ms ?? r.duration_ms
      return ms ? (
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <Clock className="size-3" />
          {(ms / 1000).toFixed(2)}s
        </div>
      ) : '—'
    },
  },
  {
    key: 'cost_usd',
    header: 'Custo',
    render: (r) =>
      r.cost_usd != null ? (
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <DollarSign className="size-3" />
          {r.cost_usd.toFixed(4)}
        </div>
      ) : '—',
  },
  {
    key: 'status',
    header: 'Status',
    render: (r) => <AgentRunStatusBadge status={r.status} />,
  },
  {
    key: 'created_at',
    header: 'Executado em',
    render: (r) => formatDate(r.created_at),
  },
]

export default function AgentesPage() {
  const pagination = usePagination()
  const { execute, data, isLoading } = useAsync(agentRunsApi.list)

  const load = useCallback(
    () => execute({ page: pagination.page, limit: pagination.limit }),
    [pagination.page],
  )

  useEffect(() => { load() }, [pagination.page])
  useEffect(() => {
    if (data?.meta.total !== undefined) pagination.setTotal(data.meta.total, data.meta.totalPages)
  }, [data?.meta.total])

  // Aggregate stats from runs
  const runs = data?.data ?? []
  const totalTokens = runs.reduce((s, r) => s + (r.tokens_in ?? 0) + (r.tokens_out ?? r.tokens_used ?? 0), 0)
  const totalCost = runs.reduce((s, r) => s + (r.cost_usd ?? 0), 0)
  const avgLatency = runs.length
    ? runs.reduce((s, r) => s + (r.latency_ms ?? r.duration_ms ?? 0), 0) / runs.length
    : 0

  return (
    <PageWrapper>
      <PageHeader
        title="Agentes IA"
        description="Execuções e desempenho dos agentes de inteligência artificial"
      />

      {!isLoading && runs.length > 0 && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader title="Total de Tokens" />
            <p className="text-2xl font-bold text-slate-100">{totalTokens.toLocaleString()}</p>
            <p className="mt-0.5 text-xs text-slate-500">nesta página</p>
          </Card>
          <Card>
            <CardHeader title="Custo Total" />
            <p className="text-2xl font-bold text-slate-100">US$ {totalCost.toFixed(4)}</p>
            <p className="mt-0.5 text-xs text-slate-500">nesta página</p>
          </Card>
          <Card>
            <CardHeader title="Latência Média" />
            <p className="text-2xl font-bold text-slate-100">{(avgLatency / 1000).toFixed(2)}s</p>
            <p className="mt-0.5 text-xs text-slate-500">por execução</p>
          </Card>
        </div>
      )}

      {!isLoading && runs.length === 0 ? (
        <EmptyState
          icon={<Bot className="size-8 text-slate-500" />}
          title="Nenhuma execução"
          description="Nenhum agente foi executado ainda."
        />
      ) : (
        <DataTable<AgentRun>
          title="Execuções de Agentes"
          columns={cols}
          data={runs}
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

