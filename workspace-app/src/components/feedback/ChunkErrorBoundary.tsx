import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  isChunkError: boolean
}

function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  const msg = error.message.toLowerCase()
  return (
    msg.includes('failed to fetch dynamically imported module') ||
    msg.includes('loading chunk') ||
    msg.includes('loading css chunk') ||
    error.name === 'ChunkLoadError'
  )
}

export class ChunkErrorBoundary extends Component<Props, State> {
  private reloadTimer: ReturnType<typeof setTimeout> | null = null

  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, isChunkError: false }
  }

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, isChunkError: isChunkLoadError(error) }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ChunkErrorBoundary]', error, info)
    if (isChunkLoadError(error)) {
      this.reloadTimer = setTimeout(() => window.location.reload(), 4000)
    }
  }

  componentWillUnmount() {
    if (this.reloadTimer) clearTimeout(this.reloadTimer)
  }

  handleReload = () => {
    if (this.reloadTimer) clearTimeout(this.reloadTimer)
    window.location.reload()
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl border border-white/10 bg-surface-2">
          <RefreshCw className="size-7 text-brand-400" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-slate-100">
            {this.state.isChunkError ? 'Nova versão disponível' : 'Algo deu errado'}
          </h2>
          <p className="max-w-sm text-sm text-slate-400">
            {this.state.isChunkError
              ? 'O sistema foi atualizado. A página será recarregada automaticamente.'
              : 'Ocorreu um erro inesperado. Tente recarregar a página.'}
          </p>
        </div>
        <button
          onClick={this.handleReload}
          className="flex items-center gap-2 rounded-xl border border-brand-500/30 bg-brand-600/20 px-5 py-2.5 text-sm font-medium text-brand-300 transition hover:bg-brand-600/30"
        >
          <RefreshCw className="size-4" />
          Recarregar agora
        </button>
        {this.state.isChunkError && (
          <p className="text-xs text-slate-600">Recarregando automaticamente em 4 segundos…</p>
        )}
      </div>
    )
  }
}
