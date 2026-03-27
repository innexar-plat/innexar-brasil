import { useEffect } from 'react'
import { BarChart3 } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { EmptyState, Spinner } from '@/components/feedback'
import { Card, CardHeader } from '@/components/ui'
import { useAsync } from '@/hooks/useAsync'
import { analyticsApi } from '@/lib/api'
import type { AnalyticsChart } from '@/types'

function SimpleLineChart({ chart }: { chart: AnalyticsChart }) {
  if (!chart.data.length) return null
  const max = Math.max(...chart.data.map((d) => d.value))
  const H = 80

  return (
    <Card>
      <CardHeader title={chart.title} />
      <div className="px-5 pb-5">
        <svg viewBox={`0 0 ${chart.data.length * 40} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 80 }}>
          <polyline
            fill="none"
            stroke="var(--color-cyan-400, #22d3ee)"
            strokeWidth={2}
            points={chart.data
              .map((d, i) => `${i * 40 + 20},${H - (d.value / (max || 1)) * (H - 10) - 5}`)
              .join(' ')}
          />
          {chart.data.map((d, i) => (
            <circle
              key={i}
              cx={i * 40 + 20}
              cy={H - (d.value / (max || 1)) * (H - 10) - 5}
              r={3}
              fill="var(--color-cyan-400, #22d3ee)"
            />
          ))}
        </svg>
        <div className="mt-2 flex justify-between text-xs text-slate-500">
          {chart.data.map((d, i) => (
            <span key={i}>{d.label ?? d.date.slice(5)}</span>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default function AnalyticsPage() {
  const revenue = useAsync(analyticsApi.revenue)
  const leads = useAsync(analyticsApi.leads)

  useEffect(() => {
    revenue.execute('30d')
    leads.execute('30d')
  }, [])

  const isLoading = revenue.isLoading || leads.isLoading
  const isEmpty = !isLoading && !revenue.data?.data.length && !leads.data?.data.length

  return (
    <PageWrapper>
      <PageHeader title="Analytics" description="Métricas e performance dos últimos 30 dias" />

      {isLoading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : isEmpty ? (
        <EmptyState
          icon={<BarChart3 className="size-8 text-slate-500" />}
          title="Sem dados"
          description="Não há dados disponíveis para o período selecionado."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {revenue.data && <SimpleLineChart chart={revenue.data} />}
          {leads.data && <SimpleLineChart chart={leads.data} />}
        </div>
      )}
    </PageWrapper>
  )
}
