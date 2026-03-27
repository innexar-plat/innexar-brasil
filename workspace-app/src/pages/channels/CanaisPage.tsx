import { useState, useEffect, useCallback } from 'react'
import { Radio, Plus, Info } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { DataTable, ChannelStatusBadge } from '@/components/data'
import type { Column } from '@/components/data'
import { EmptyState } from '@/components/feedback'
import { Badge, Button, Modal } from '@/components/ui'
import { useAsync } from '@/hooks/useAsync'
import { usePagination } from '@/hooks/usePagination'
import { channelsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Channel } from '@/types'

const TYPE_LABELS: Record<string, string> = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  facebook: 'Facebook',
  email: 'E-mail',
  sms: 'SMS',
  webchat: 'WebChat',
}

const CHANNEL_TYPES = [
  { id: 'whatsapp', label: 'WhatsApp Business API', desc: 'Conecte via Meta Business Suite ou provedor como Twilio, Z-API, Evolution API.' },
  { id: 'instagram', label: 'Instagram Direct', desc: 'Conecte via API do Instagram Graph com permissão messages.' },
  { id: 'email', label: 'E-mail (SMTP/IMAP)', desc: 'Configure servidor SMTP de saída e IMAP para recepção.' },
  { id: 'webchat', label: 'Chat no Site', desc: 'Adicione o widget de chat ao seu site com snippet JavaScript.' },
]

const cols: Column<Channel>[] = [
  { key: 'name', header: 'Nome', render: (r) => <span className="font-medium text-white">{r.name}</span> },
  { key: 'type', header: 'Tipo', render: (r) => <Badge variant="info" size="sm">{TYPE_LABELS[r.type] ?? r.type}</Badge> },
  { key: 'phone_number', header: 'Identificador', render: (r) => r.phone_number ?? r.username ?? '—' },
  { key: 'is_active', header: 'Ativo', render: (r) => <Badge variant={r.is_active ? 'success' : 'default'} dot size="sm">{r.is_active ? 'Sim' : 'Não'}</Badge> },
  { key: 'status', header: 'Status', render: (r) => <ChannelStatusBadge status={r.status} /> },
  { key: 'created_at', header: 'Criado em', render: (r) => formatDate(r.created_at) },
]

export default function CanaisPage() {
  const pagination = usePagination()
  const { execute, data, isLoading } = useAsync(channelsApi.list)
  const [isOpen, setIsOpen] = useState(false)

  const load = useCallback(() => execute({ page: pagination.page, limit: pagination.limit }), [pagination.page])
  useEffect(() => { load() }, [pagination.page])
  useEffect(() => {
    if (data?.meta.total !== undefined) pagination.setTotal(data.meta.total, data.meta.totalPages)
  }, [data?.meta.total])

  return (
    <PageWrapper>
      <PageHeader
        title="Canais"
        description="Canais de comunicação integrados"
        actions={[{ label: 'Conectar Canal', onClick: () => setIsOpen(true), icon: <Plus className="size-4" /> }]}
      />

      {!isLoading && data?.data.length === 0 ? (
        <EmptyState
          icon={<Radio className="size-8 text-slate-500" />}
          title="Nenhum canal"
          description="Conecte um canal para começar a receber mensagens."
        />
      ) : (
        <DataTable<Channel>
          title="Canais"
          columns={cols}
          data={data?.data ?? []}
          isLoading={isLoading}
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          onPrev={pagination.prevPage}
          onNext={pagination.nextPage}
          canPrev={pagination.canPrev}
          canNext={pagination.canNext}
        />
      )}

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Conectar Novo Canal"
        description="Escolha o tipo de canal e siga as instruções de conexão."
        size="lg"
        footer={<Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>Fechar</Button>}
      >
        <div className="space-y-3">
          {CHANNEL_TYPES.map((ct) => (
            <div
              key={ct.id}
              className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/4 p-4 hover:border-brand-500/30 hover:bg-brand-500/5 transition cursor-pointer"
            >
              <Info className="mt-0.5 size-4 shrink-0 text-brand-400" />
              <div>
                <p className="font-medium text-slate-100">{ct.label}</p>
                <p className="mt-0.5 text-sm text-slate-500">{ct.desc}</p>
              </div>
            </div>
          ))}
          <p className="text-xs text-slate-500 pt-1">
            A conexão real requer configuração no painel de integradores. Entre em contato com o suporte.
          </p>
        </div>
      </Modal>
    </PageWrapper>
  )
}

