import { forwardRef, type InputHTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string
  description?: string
  size?: 'sm' | 'md'
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, description, size = 'md', checked, className, id, ...props }, ref) => {
    const switchId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    const trackClass = size === 'sm' ? 'w-8 h-4' : 'w-11 h-6'
    const thumbClass = size === 'sm' ? 'size-3' : 'size-4'
    const translateX  = size === 'sm' ? 16 : 20

    return (
      <label
        htmlFor={switchId}
        className={cn('flex items-center gap-3 cursor-pointer select-none', className)}
      >
        {/* Hidden input */}
        <input
          ref={ref}
          id={switchId}
          type="checkbox"
          checked={checked}
          className="sr-only"
          {...props}
        />

        {/* Track */}
        <div
          className={cn(
            'relative flex-shrink-0 rounded-full border transition-colors duration-200',
            trackClass,
            checked
              ? 'bg-brand-600 border-brand-500'
              : 'bg-white/8 border-white/12',
          )}
        >
          {/* Thumb */}
          <motion.div
            animate={{ x: checked ? translateX - (size === 'sm' ? 12 : 16) : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={cn(
              'absolute top-0.5 rounded-full bg-white shadow',
              thumbClass,
            )}
          />
        </div>

        {/* Label */}
        {(label || description) && (
          <div>
            {label && <p className="text-sm font-medium text-slate-200">{label}</p>}
            {description && <p className="text-xs text-slate-500">{description}</p>}
          </div>
        )}
      </label>
    )
  },
)

Switch.displayName = 'Switch'
