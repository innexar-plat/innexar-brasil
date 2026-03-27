import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

// ─── Props ────────────────────────────────────────────────────────────────────
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  errorText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
  inputSize?: 'sm' | 'md' | 'lg'
}

const SIZE_CLASSES = {
  sm: 'h-8 text-xs px-3',
  md: 'h-9 text-sm px-3',
  lg: 'h-11 text-sm px-4',
}

// ─── Component ────────────────────────────────────────────────────────────────
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorText,
      leftIcon,
      rightIcon,
      fullWidth = true,
      inputSize = 'md',
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const hasError = Boolean(errorText)

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-medium uppercase tracking-wide text-slate-400"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <span className="pointer-events-none absolute left-3 text-slate-500">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-xl border bg-white/5 text-slate-100 placeholder-slate-500 outline-none transition-all duration-150',
              'focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/15',
              hasError
                ? 'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/15'
                : 'border-white/10 hover:border-white/18',
              leftIcon && 'pl-9',
              rightIcon && 'pr-9',
              SIZE_CLASSES[inputSize],
              'disabled:cursor-not-allowed disabled:opacity-50',
              className,
            )}
            {...props}
          />

          {rightIcon && (
            <span className="pointer-events-none absolute right-3 text-slate-500">
              {rightIcon}
            </span>
          )}
        </div>

        {(helperText || errorText) && (
          <p className={cn('text-xs', hasError ? 'text-red-400' : 'text-slate-500')}>
            {errorText ?? helperText}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = 'Input'
