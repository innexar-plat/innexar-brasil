import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZES = {
  sm: 'size-4 border-2',
  md: 'size-7 border-2',
  lg: 'size-10 border-[3px]',
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-brand-500/30 border-t-brand-500',
        SIZES[size],
        className,
      )}
      role="status"
      aria-label="Carregando"
    />
  )
}
