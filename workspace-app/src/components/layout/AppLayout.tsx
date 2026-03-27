import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

function titleFromPath(pathname: string): string {
  const map: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/crm': 'CRM',
    '/leads': 'Leads',
    '/contatos': 'Contatos',
    '/clientes': 'Clientes',
    '/campanhas': 'Campanhas',
    '/inbox': 'Inbox',
    '/canais': 'Canais',
    '/templates': 'Templates',
    '/agentes': 'Agentes IA',
    '/analytics': 'Analytics',
    '/tickets': 'Tickets',
    '/settings': 'Configurações',
  }
  return map[pathname] ?? 'Innexar'
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen overflow-hidden bg-surface-0">
      <Sidebar isMobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={titleFromPath(location.pathname)} onMenuToggle={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <Outlet key={location.pathname} />
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
