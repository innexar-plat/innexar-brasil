import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

export interface PageAction {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  icon?: ReactNode
}

interface PageHeaderProps {
  title: string
  description?: string
  actions?: PageAction[]
  breadcrumb?: { label: string; href?: string }[]
  className?: string
}

export function PageHeader({ title, description, actions, breadcrumb, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between', className)}>
      <div>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-1 flex items-center gap-1.5 text-xs text-slate-500">
            {breadcrumb.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <span>/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-slate-300 transition-colors">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-slate-400">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-xl font-bold text-slate-100">{title}</h1>
        {description && <p className="mt-0.5 text-sm text-slate-400">{description}</p>}
      </div>

      {actions && actions.length > 0 && (
        <div className="mt-3 flex items-center gap-2 sm:mt-0 shrink-0">
          {actions.map((action, i) => (
            <Button
              key={i}
              variant={action.variant ?? 'primary'}
              size="sm"
              onClick={action.onClick}
              leftIcon={action.icon}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
