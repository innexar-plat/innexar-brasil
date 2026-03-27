import type { ReactNode } from 'react'
import { Button } from '@/components/ui'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      {icon && (
        <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-500">
          {icon}
        </div>
      )}
      <div>
        <p className="text-base font-medium text-slate-300">{title}</p>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {action && (
        <Button variant="secondary" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
