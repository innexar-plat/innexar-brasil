import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

// ─── Card Root ────────────────────────────────────────────────────────────────
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean
  noPadding?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, noPadding = false, children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl bg-surface-2 border border-white/8 transition-all duration-200',
        hoverable && 'cursor-pointer hover:border-white/14 hover:bg-surface-3 hover:-translate-y-0.5 hover:shadow-card',
        !noPadding && 'p-5',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
)
Card.displayName = 'Card'

// ─── Card Header ──────────────────────────────────────────────────────────────
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  action?: ReactNode
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, description, action, className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-start justify-between gap-4 mb-4', className)} {...props}>
      <div>
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  ),
)
CardHeader.displayName = 'CardHeader'

// ─── Card Footer ──────────────────────────────────────────────────────────────
export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ children, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-4 pt-4 border-t border-white/8 flex items-center justify-between gap-3', className)}
      {...props}
    >
      {children}
    </div>
  ),
)
CardFooter.displayName = 'CardFooter'
