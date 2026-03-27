import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = 'Algo deu errado',
  message = 'Ocorreu um erro inesperado. Tente novamente.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-red-500/25 bg-red-500/10">
        <AlertTriangle className="size-7 text-red-400" />
      </div>
      <div>
        <p className="text-base font-semibold text-slate-200">{title}</p>
        <p className="mt-1 text-sm text-slate-500">{message}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Tentar novamente
        </Button>
      )}
    </div>
  )
}
