import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Users,
  UserCircle,
  TrendingUp,
  Megaphone,
  MessageSquare,
  Radio,
  Bot,
  BarChart3,
  FileText,
  TicketCheck,
  Settings,
  ChevronDown,
  LogOut,
  X,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar } from '@/components/ui'
import { ROUTES } from '@/lib/constants'

interface NavItem {
  to: string
  icon: React.ReactNode
  label: string
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Geral',
    items: [{ to: ROUTES.DASHBOARD, icon: <LayoutDashboard className="size-4" />, label: 'Dashboard' }],
  },
  {
    title: 'Comercial',
    items: [
      { to: ROUTES.CRM, icon: <TrendingUp className="size-4" />, label: 'CRM' },
      { to: ROUTES.LEADS, icon: <UserCircle className="size-4" />, label: 'Leads' },
      { to: ROUTES.CONTATOS, icon: <Users className="size-4" />, label: 'Contatos' },
      { to: ROUTES.CLIENTES, icon: <Users className="size-4" />, label: 'Clientes' },
    ],
  },
  {
    title: 'Comunicação',
    items: [
      { to: ROUTES.CAMPANHAS, icon: <Megaphone className="size-4" />, label: 'Campanhas' },
      { to: ROUTES.INBOX, icon: <MessageSquare className="size-4" />, label: 'Inbox' },
      { to: ROUTES.CANAIS, icon: <Radio className="size-4" />, label: 'Canais' },
      { to: ROUTES.TEMPLATES, icon: <FileText className="size-4" />, label: 'Templates' },
    ],
  },
  {
    title: 'IA & Automação',
    items: [{ to: ROUTES.AGENTES, icon: <Bot className="size-4" />, label: 'Agentes IA' }],
  },
  {
    title: 'Insights',
    items: [{ to: ROUTES.ANALYTICS, icon: <BarChart3 className="size-4" />, label: 'Analytics' }],
  },
  {
    title: 'Suporte',
    items: [{ to: ROUTES.TICKETS, icon: <TicketCheck className="size-4" />, label: 'Tickets' }],
  },
  {
    title: 'Sistema',
    items: [{ to: ROUTES.SETTINGS, icon: <Settings className="size-4" />, label: 'Configurações' }],
  },
]

function NavGroup({ group }: { group: NavGroup }) {
  return (
    <div className="mb-4">
      <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-600">
        {group.title}
      </p>
      {group.items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150 ${
              isActive
                ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`
          }
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </div>
  )
}

interface SidebarProps {
  isMobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/5 px-4 py-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-brand-600">
          <span className="text-xs font-black text-white">IN</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white">Innexar</p>
          <p className="text-[11px] text-slate-500">Workspace</p>
        </div>
        <button
          className="ml-auto rounded-lg p-1 text-slate-500 hover:text-slate-300 md:hidden"
          onClick={onMobileClose}
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4 scrollbar-thin">
        {NAV_GROUPS.map((g) => (
          <NavGroup key={g.title} group={g} />
        ))}
      </nav>

      {/* User section */}
      <div className="border-t border-white/5 p-3">
        <button
          onClick={() => setShowUserMenu((v) => !v)}
          className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/5"
        >
          <Avatar name={user?.name ?? 'U'} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user?.name}</p>
            <p className="truncate text-xs text-slate-500">{user?.email}</p>
          </div>
          <ChevronDown
            className={`size-4 text-slate-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
          />
        </button>
        <AnimatePresence>
          {showUserMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <button
                onClick={logout}
                className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="size-4" />
                Sair
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r border-white/5 bg-surface-1 md:flex md:flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed inset-y-0 left-0 z-50 w-60 border-r border-white/5 bg-surface-1 md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
