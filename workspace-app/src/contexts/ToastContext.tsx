import {
  createContext,
  useCallback,
  useContext,
  useId,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────
export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  variant: ToastVariant
  title: string
  description?: string
  duration?: number
}

type AddToastPayload = Omit<Toast, 'id'>

interface ToastContextValue {
  success: (title: string, description?: string) => void
  error: (title: string, description?: string) => void
  warning: (title: string, description?: string) => void
  info: (title: string, description?: string) => void
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null)

// ─── Icons & styles per variant ───────────────────────────────────────────────
const VARIANT_CONFIG: Record<ToastVariant, { icon: typeof CheckCircle; color: string; bg: string }> = {
  success: { icon: CheckCircle, color: 'text-green-400',  bg: 'border-green-500/30 bg-green-500/10' },
  error:   { icon: XCircle,     color: 'text-red-400',    bg: 'border-red-500/30 bg-red-500/10' },
  warning: { icon: AlertTriangle,color: 'text-amber-400', bg: 'border-amber-500/30 bg-amber-500/10' },
  info:    { icon: Info,         color: 'text-blue-400',   bg: 'border-blue-500/30 bg-blue-500/10' },
}

// ─── Single Toast Item ────────────────────────────────────────────────────────
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const { icon: Icon, color, bg } = VARIANT_CONFIG[toast.variant]

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 64, scale: 0.95 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-auto flex w-80 items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-2xl ${bg}`}
    >
      <Icon className={`mt-0.5 size-4 shrink-0 ${color}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-100">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-xs text-slate-400">{toast.description}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="mt-0.5 rounded p-0.5 text-slate-500 transition hover:text-slate-200"
        aria-label="Fechar"
      >
        <X className="size-3.5" />
      </button>
    </motion.div>
  )
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const baseId = useId()
  let counter = 0

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const add = useCallback((payload: AddToastPayload) => {
    const id = `${baseId}-${Date.now()}-${counter++}`
    const duration = payload.duration ?? 4500
    setToasts((prev) => [...prev, { ...payload, id }])
    setTimeout(() => remove(id), duration)
  }, [baseId, remove]) // eslint-disable-line react-hooks/exhaustive-deps

  const ctx: ToastContextValue = {
    success: (title, description) => add({ variant: 'success', title, description }),
    error:   (title, description) => add({ variant: 'error',   title, description }),
    warning: (title, description) => add({ variant: 'warning', title, description }),
    info:    (title, description) => add({ variant: 'info',    title, description }),
  }

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      {/* Toast stack — fixed bottom-right */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[9999] flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onRemove={remove} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
