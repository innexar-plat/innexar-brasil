import { createContext, useContext, useState, type ReactNode, type HTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ─── Context ──────────────────────────────────────────────────────────────────
interface TabsContextValue {
  active: string
  setActive: (value: string) => void
  variant: 'pills' | 'underline'
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs compound component used outside <Tabs>')
  return ctx
}

// ─── Tabs Root ────────────────────────────────────────────────────────────────
export interface TabsProps {
  defaultValue: string
  value?: string
  onValueChange?: (value: string) => void
  variant?: 'pills' | 'underline'
  children: ReactNode
  className?: string
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  variant = 'pills',
  children,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue)
  const active = value ?? internalValue

  const setActive = (v: string) => {
    if (!value) setInternalValue(v)
    onValueChange?.(v)
  }

  return (
    <TabsContext.Provider value={{ active, setActive, variant }}>
      <div className={cn('flex flex-col', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

// ─── TabsList ─────────────────────────────────────────────────────────────────
export function TabsList({ children, className }: HTMLAttributes<HTMLDivElement>) {
  const { variant } = useTabsContext()
  return (
    <div
      className={cn(
        'flex items-center gap-1',
        variant === 'pills' && 'rounded-xl bg-white/5 border border-white/8 p-1',
        variant === 'underline' && 'border-b border-white/8 gap-0',
        className,
      )}
    >
      {children}
    </div>
  )
}

// ─── TabsTrigger ──────────────────────────────────────────────────────────────
export interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string
}

export function TabsTrigger({ value, children, className, ...props }: TabsTriggerProps) {
  const { active, setActive, variant } = useTabsContext()
  const isActive = active === value

  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => setActive(value)}
      className={cn(
        'relative flex items-center gap-2 text-sm font-medium transition-colors duration-150 cursor-pointer select-none',
        variant === 'pills' && 'rounded-lg px-3 py-1.5',
        variant === 'underline' && 'px-4 py-2.5',
        isActive ? 'text-slate-100' : 'text-slate-500 hover:text-slate-300',
        className,
      )}
      {...props}
    >
      {variant === 'pills' && isActive && (
        <motion.div
          layoutId="tab-indicator-pills"
          className="absolute inset-0 rounded-lg bg-brand-600/80"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      {variant === 'underline' && isActive && (
        <motion.div
          layoutId="tab-indicator-underline"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  )
}

// ─── TabsContent ──────────────────────────────────────────────────────────────
export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string
}

export function TabsContent({ value, children, className, ...props }: TabsContentProps) {
  const { active } = useTabsContext()
  if (active !== value) return null
  return (
    <div role="tabpanel" className={cn('mt-4', className)} {...props}>
      {children}
    </div>
  )
}
