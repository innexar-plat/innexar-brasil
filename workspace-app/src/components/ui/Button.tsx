import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Variants + Sizes ─────────────────────────────────────────────────────────
const VARIANTS = {
  primary: 'bg-brand-600 text-white hover:bg-brand-500 glow-sm active:scale-[0.98]',
  secondary: 'bg-white/8 text-slate-200 border border-white/10 hover:bg-white/12 hover:border-white/20',
  ghost: 'text-slate-300 hover:bg-white/6 hover:text-white',
  danger: 'bg-red-600/90 text-white hover:bg-red-500 active:scale-[0.98]',
  outline: 'border border-brand-500/50 text-brand-400 hover:bg-brand-500/10 hover:border-brand-500',
  success: 'bg-green-600/90 text-white hover:bg-green-500 active:scale-[0.98]',
} as const

const SIZES = {
  xs: 'h-7 px-2.5 text-xs gap-1.5 rounded-lg',
  sm: 'h-8 px-3 text-sm gap-1.5 rounded-lg',
  md: 'h-9 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-11 px-6 text-base gap-2 rounded-xl',
  xl: 'h-13 px-8 text-base gap-2.5 rounded-2xl',
} as const

// ─── Props ────────────────────────────────────────────────────────────────────
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS
  size?: keyof typeof SIZES
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
          VARIANTS[variant],
          SIZES[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    )
  },
)

Button.displayName = 'Button'
