import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  rounded?: 'sm' | 'md' | 'lg' | 'full'
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ rounded = 'md', className, ...props }, ref) => {
    const roundedClass = {
      sm:   'rounded',
      md:   'rounded-lg',
      lg:   'rounded-xl',
      full: 'rounded-full',
    }[rounded]

    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse bg-white/6',
          roundedClass,
          className,
        )}
        {...props}
      />
    )
  },
)

Skeleton.displayName = 'Skeleton'

// ─── Preset skeletons ─────────────────────────────────────────────────────────
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3.5', i === lines - 1 ? 'w-3/5' : 'w-full')}
        />
      ))}
    </div>
  )
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-2xl border border-white/8 bg-surface-2 p-5 space-y-3', className)}>
      <div className="flex items-center gap-3">
        <Skeleton className="size-10" rounded="full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      </div>
      <SkeletonText lines={2} />
    </div>
  )
}

export function SkeletonRow({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-4 py-3', className)}>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-6 w-16" rounded="full" />
      <Skeleton className="h-4 w-20" />
    </div>
  )
}
