import { useEffect, useState } from 'react'
import { MessageSquare, Mail, CheckCheck } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { EmptyState, Spinner } from '@/components/feedback'
import { Badge, Tabs, TabsList, TabsTrigger } from '@/components/ui'
import { useAsync } from '@/hooks/useAsync'
import { inboxApi } from '@/lib/api'
import type { InboxMessage } from '@/types'

const CHANNEL_ICONS: Record<string, string> = {
  whatsapp: '📱',
  email: '📧',
  instagram: '📸',
  facebook: '💬',
  sms: '📝',
  webchat: '🖥️',
}

function MessageRow({ msg }: { msg: InboxMessage }) {
  const isUnread = msg.status === 'unread'
  return (
    <div className="flex cursor-pointer items-center gap-4 rounded-xl border border-white/5 bg-surface-2 p-4 transition hover:bg-surface-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-600/15 text-xl">
        {CHANNEL_ICONS[msg.channel] ?? <MessageSquare className="size-5 text-brand-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className={`truncate font-medium ${isUnread ? 'text-white' : 'text-slate-300'}`}>
            {msg.contact_id}
          </p>
          <span className="ml-4 shrink-0 text-xs text-slate-500 capitalize">{msg.channel}</span>
        </div>
        <p className={`mt-0.5 truncate text-sm ${isUnread ? 'text-slate-300' : 'text-slate-500'}`}>
          {msg.content}
        </p>
      </div>
      {isUnread ? (
        <Badge variant="brand" size="sm">Não lida</Badge>
      ) : (
        <CheckCheck className="size-4 text-slate-600 shrink-0" />
      )}
    </div>
  )
}

export default function InboxPage() {
  const { execute, data, isLoading } = useAsync(inboxApi.messages)
  const [tab, setTab] = useState('all')

  useEffect(() => { execute({ page: 1, limit: 50 }) }, [])

  const messages = data?.data ?? []
  const unread = messages.filter(m => m.status === 'unread')
  const read = messages.filter(m => m.status !== 'unread')

  const filtered = tab === 'all' ? messages : tab === 'unread' ? unread : read

  return (
    <PageWrapper>
      <PageHeader
        title="Inbox"
        description="Mensagens dos canais de comunicação"
      />

      <Tabs defaultValue="all" value={tab} onValueChange={setTab}>
        <TabsList className="mb-5">
          <TabsTrigger value="all">
            Todas <Badge variant="default" size="sm" className="ml-1.5">{messages.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="unread">
            Não Lidas {unread.length > 0 && <Badge variant="brand" size="sm" className="ml-1.5">{unread.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="read">
            Lidas <Badge variant="default" size="sm" className="ml-1.5">{read.length}</Badge>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Mail className="size-8 text-slate-500" />}
          title={tab === 'unread' ? 'Nenhuma mensagem não lida' : 'Inbox vazio'}
          description="Nenhuma mensagem encontrada nesta visualização."
        />
      ) : (
        <div className="space-y-2">
          {filtered.map((msg) => (
            <MessageRow key={msg.id} msg={msg} />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}

