import { Bell, Menu } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Avatar } from '@/components/ui'

interface HeaderProps {
  title?: string
  onMenuToggle: () => void
}

export function Header({ title, onMenuToggle }: HeaderProps) {
  const { user } = useAuth()

  return (
    <header className="flex h-14 shrink-0 items-center gap-4 border-b border-white/5 bg-surface-0/80 px-4 backdrop-blur">
      <button
        onClick={onMenuToggle}
        className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white md:hidden"
        aria-label="Toggle menu"
      >
        <Menu className="size-5" />
      </button>

      {title && (
        <span className="hidden text-sm font-semibold text-white sm:block">{title}</span>
      )}

      <div className="ml-auto flex items-center gap-2">
        <button className="relative rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white">
          <Bell className="size-4.5" />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-brand-500" />
        </button>
        <Avatar name={user?.name ?? 'U'} size="sm" />
      </div>
    </header>
  )
}
