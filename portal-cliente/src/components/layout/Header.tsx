import { Menu, Bell } from 'lucide-react'
import { Avatar } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'

interface HeaderProps {
  onMenuClick: () => void
  pageTitle?: string
}

export function Header({ onMenuClick, pageTitle }: HeaderProps) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/7 bg-surface-0/80 px-4 backdrop-blur-xl">
      {/* Left — burger + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/8 hover:text-slate-200 transition lg:hidden"
          aria-label="Menu"
        >
          <Menu className="size-4" />
        </button>
        {pageTitle && (
          <h2 className="text-sm font-semibold text-slate-200 hidden sm:block">{pageTitle}</h2>
        )}
      </div>

      {/* Right — notifications + avatar */}
      <div className="flex items-center gap-2">
        <button
          className="relative flex size-8 items-center justify-center rounded-lg text-slate-500 hover:bg-white/8 hover:text-slate-200 transition"
          aria-label="Notificações"
        >
          <Bell className="size-4" />
        </button>
        {user && <Avatar name={user.name} size="sm" />}
      </div>
    </header>
  )
}
