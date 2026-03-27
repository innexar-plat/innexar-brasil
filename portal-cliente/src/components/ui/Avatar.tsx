import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

const SIZES = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-16 text-xl',
} as const

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string
  src?: string
  size?: keyof typeof SIZES
  color?: string
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase()
}

// Deterministic color from name
const COLORS = [
  'from-brand-600 to-brand-800',
  'from-purple-600 to-purple-800',
  'from-cyan-600 to-cyan-800',
  'from-emerald-600 to-emerald-800',
  'from-rose-600 to-rose-800',
  'from-amber-600 to-amber-800',
]

function getColor(name: string): string {
  const idx = name.charCodeAt(0) % COLORS.length
  return COLORS[idx]!
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ name, src, size = 'md', className, ...props }, ref) => {
    const initials = getInitials(name)
    const colorClass = getColor(name)

    return (
      <div
        ref={ref}
        className={cn(
          'shrink-0 rounded-full overflow-hidden flex items-center justify-center font-semibold text-white select-none',
          SIZES[size],
          !src && `bg-gradient-to-br ${colorClass}`,
          className,
        )}
        title={name}
        {...props}
      >
        {src ? (
          <img src={src} alt={name} className="size-full object-cover" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
    )
  },
)

Avatar.displayName = 'Avatar'
