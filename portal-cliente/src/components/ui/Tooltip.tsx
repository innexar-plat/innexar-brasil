import { useState, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  content: ReactNode
  placement?: TooltipPlacement
  delay?: number
  className?: string
  children: ReactNode
}

const TOOLTIP_CLASSES: Record<TooltipPlacement, string> = {
  top:    '-top-2 left-1/2 -translate-x-1/2 -translate-y-full',
  bottom: '-bottom-2 left-1/2 -translate-x-1/2 translate-y-full',
  left:   'top-1/2 -left-2 -translate-x-full -translate-y-1/2',
  right:  'top-1/2 -right-2 translate-x-full -translate-y-1/2',
}

export function Tooltip({ content, placement = 'top', delay = 300, children, className }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => {
    timer.current = setTimeout(() => setVisible(true), delay)
  }

  const hide = () => {
    if (timer.current) clearTimeout(timer.current)
    setVisible(false)
  }

  return (
    <div
      className={cn('relative inline-flex', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.14 }}
            role="tooltip"
            className={cn(
              'pointer-events-none absolute z-50 whitespace-nowrap rounded-lg border border-white/10 bg-surface-3 px-2.5 py-1.5 text-xs text-slate-200 shadow-lg',
              TOOLTIP_CLASSES[placement],
            )}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
