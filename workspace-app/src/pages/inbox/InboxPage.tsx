import { useEffect } from 'react'
import { MessageSquare } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { EmptyState, Spinner } from '@/components/feedback'
import { Badge } from '@/components/ui'
import { useAsync } from '@/hooks/useAsync'
import { inboxApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Conversation } from '@/types'

function ConversationRow({ conv }: { conv: Conversation }) {
  return (
    <div className="flex cursor-pointer items-center gap-4 rounded-xl border border-white/5 bg-surface-2 p-4 transition hover:bg-surface-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-600/15 text-brand-400">
        <MessageSquare className="size-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="truncate font-medium text-white">
            {conv.contact?.name ?? 'Contato desconhecido'}
          </p>
          <span className="ml-4 shrink-0 text-xs text-slate-500">{formatDate(conv.updated_at)}</span>
        </div>
        {conv.last_message && (
          <p className="mt-0.5 truncate text-sm text-slate-400">{conv.last_message.content}</p>
        )}
      </div>
      {conv.unread_count > 0 && (
        <Badge variant="brand" size="sm">{conv.unread_count}</Badge>
      )}
    </div>
  )
}

export default function InboxPage() {
  const { execute, data, isLoading } = useAsync(inboxApi.conversations)

  useEffect(() => {
    execute({ page: 1, limit: 50 })
  }, [])

  return (
    <PageWrapper>
      <PageHeader title="Inbox" description="Conversas e mensagens dos canais" />

      {isLoading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : !data?.data.length ? (
        <EmptyState
          icon={<MessageSquare className="size-8 text-slate-500" />}
          title="Inbox vazio"
          description="Nenhuma conversa ativa no momento."
        />
      ) : (
        <div className="space-y-2">
          {data.data.map((conv) => (
            <ConversationRow key={conv.id} conv={conv} />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
