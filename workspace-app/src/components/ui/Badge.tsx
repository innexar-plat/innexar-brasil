import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

// ─── Variants ─────────────────────────────────────────────────────────────────
const VARIANTS = {
  default:  'bg-white/8 text-slate-300 border border-white/10',
  brand:    'bg-brand-500/15 text-brand-300 border border-brand-500/25',
  success:  'bg-green-500/12 text-green-400 border border-green-500/25',
  warning:  'bg-amber-500/12 text-amber-400 border border-amber-500/25',
  danger:   'bg-red-500/12 text-red-400 border border-red-500/25',
  info:     'bg-blue-500/12 text-blue-400 border border-blue-500/25',
  purple:   'bg-purple-500/12 text-purple-400 border border-purple-500/25',
  cyan:     'bg-cyan-500/12 text-cyan-400 border border-cyan-500/25',
} as const

const SIZES = {
  sm: 'h-5 px-1.5 text-[10px] gap-1',
  md: 'h-6 px-2 text-xs gap-1.5',
  lg: 'h-7 px-2.5 text-xs gap-1.5',
} as const

// ─── Props ────────────────────────────────────────────────────────────────────
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof VARIANTS
  size?: keyof typeof SIZES
  dot?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', size = 'md', dot = false, children, className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'size-1.5 rounded-full',
            {
              default: 'bg-slate-400',
              brand:   'bg-brand-400',
              success: 'bg-green-400',
              warning: 'bg-amber-400',
              danger:  'bg-red-400',
              info:    'bg-blue-400',
              purple:  'bg-purple-400',
              cyan:    'bg-cyan-400',
            }[variant],
          )}
        />
      )}
      {children}
    </span>
  ),
)

Badge.displayName = 'Badge'
