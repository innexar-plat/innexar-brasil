import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Package,
  FileText,
  CreditCard,
  RefreshCcw,
  LifeBuoy,
  LogOut,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar } from '@/components/ui'

// ─── Nav items ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { to: '/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/produtos',     icon: Package,         label: 'Produtos' },
  { to: '/assinaturas',  icon: RefreshCcw,      label: 'Assinaturas' },
  { to: '/faturas',      icon: FileText,        label: 'Faturas' },
  { to: '/pagamentos',   icon: CreditCard,      label: 'Pagamentos' },
  { to: '/suporte',      icon: LifeBuoy,        label: 'Suporte' },
]

// ─── Props ────────────────────────────────────────────────────────────────────
interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth()

  const content = (
    <aside className="flex h-full w-64 flex-col bg-surface-1 border-r border-white/7">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-xl bg-brand-600 glow-sm">
            <div className="size-3.5 rounded-md bg-white/90" />
          </div>
          <span className="text-sm font-bold text-slate-100">
            Portal <span className="text-brand-400">Cliente</span>
          </span>
        </div>
        {/* Mobile close */}
        <button
          onClick={onClose}
          className="flex size-7 items-center justify-center rounded-lg text-slate-500 hover:bg-white/8 hover:text-slate-200 transition lg:hidden"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-2">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-brand-600/20 text-brand-300 border border-brand-500/25'
                  : 'text-slate-400 hover:bg-white/6 hover:text-slate-200',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('size-4 shrink-0', isActive ? 'text-brand-400' : 'text-slate-500')} />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      {user && (
        <div className="border-t border-white/7 p-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            <Avatar name={user.name} size="sm" className="shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-medium text-slate-200">{user.name}</p>
              <p className="truncate text-[10px] text-slate-500">{user.email}</p>
            </div>
            <button
              onClick={logout}
              title="Sair"
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-red-500/12 hover:text-red-400"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        </div>
      )}
    </aside>
  )

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex h-screen sticky top-0 shrink-0">{content}</div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 lg:hidden"
            >
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
