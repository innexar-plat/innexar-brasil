import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  trend?: { value: number; label?: string }
  description?: string
  accent?: 'brand' | 'success' | 'warning' | 'danger' | 'cyan'
  index?: number
}

const ACCENT_STYLES: Record<NonNullable<StatCardProps['accent']>, { icon: string; glow: string }> = {
  brand:   { icon: 'bg-brand-600/20 text-brand-400 border-brand-500/20',   glow: 'glow-sm' },
  success: { icon: 'bg-green-600/20 text-green-400 border-green-500/20',   glow: '' },
  warning: { icon: 'bg-amber-600/20 text-amber-400 border-amber-500/20',   glow: '' },
  danger:  { icon: 'bg-red-600/20 text-red-400 border-red-500/20',         glow: '' },
  cyan:    { icon: 'bg-cyan-600/20 text-cyan-400 border-cyan-500/20',      glow: 'glow-cyan' },
}

export function StatCard({ label, value, icon, trend, description, accent = 'brand', index = 0 }: StatCardProps) {
  const styles = ACCENT_STYLES[accent]
  const trendVal = trend?.value ?? 0
  const isPositive = trendVal > 0
  const isNeutral  = trendVal === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-white/8 bg-surface-2 p-5 flex flex-col gap-4 hover:border-white/13 transition-all duration-200"
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        {icon && (
          <div className={cn('flex size-9 items-center justify-center rounded-xl border', styles.icon, styles.glow)}>
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div>
        <p className="text-2xl font-bold text-slate-100 tabular-nums">{value}</p>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>

      {/* Trend */}
      {trend && (
        <div className="flex items-center gap-1.5">
          {isNeutral ? (
            <Minus className="size-3.5 text-slate-500" />
          ) : isPositive ? (
            <TrendingUp className="size-3.5 text-green-400" />
          ) : (
            <TrendingDown className="size-3.5 text-red-400" />
          )}
          <span
            className={cn(
              'text-xs font-medium',
              isNeutral ? 'text-slate-500' : isPositive ? 'text-green-400' : 'text-red-400',
            )}
          >
            {isPositive ? '+' : ''}{trendVal}%
          </span>
          {trend.label && <span className="text-xs text-slate-600">{trend.label}</span>}
        </div>
      )}
    </motion.div>
  )
}
