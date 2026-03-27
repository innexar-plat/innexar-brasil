import { Spinner } from './Spinner'

interface LoadingPageProps {
  message?: string
}

export function LoadingPage({ message = 'Carregando...' }: LoadingPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface-0">
      <div className="relative">
        <div className="size-16 rounded-full border-2 border-brand-500/20 bg-brand-600/10" />
        <Spinner size="lg" className="absolute inset-3" />
      </div>
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  )
}
