import { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: SelectOption[]
  placeholder?: string
  errorText?: string
  helperText?: string
  fullWidth?: boolean
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, options, placeholder, errorText, helperText, fullWidth = true, className, id, ...props },
    ref,
  ) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    const hasError = Boolean(errorText)

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label htmlFor={selectId} className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none rounded-xl border bg-white/5 py-2 pl-3 pr-9 text-sm text-slate-100 outline-none transition-all',
              'focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/15',
              hasError
                ? 'border-red-500/50 focus:border-red-500/60 focus:ring-red-500/15'
                : 'border-white/10 hover:border-white/18',
              'disabled:cursor-not-allowed disabled:opacity-50',
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-surface-2 text-slate-100">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
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

Select.displayName = 'Select'
