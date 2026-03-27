import { useState, useEffect, useCallback } from 'react'
import { Megaphone, Plus, Pencil } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { DataTable, CampaignStatusBadge } from '@/components/data'
import type { Column } from '@/components/data'
import { Badge, Button, Input, Modal, Select } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { useAsync } from '@/hooks/useAsync'
import { usePagination } from '@/hooks/usePagination'
import { campaignsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Campaign } from '@/types'

const CHANNEL_LABELS: Record<string, string> = {
  email: 'E-mail',
  whatsapp: 'WhatsApp',
  sms: 'SMS',
  push: 'Push',
}

const CHANNEL_OPTIONS = [
  { value: 'email', label: 'E-mail' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'sms', label: 'SMS' },
  { value: 'push', label: 'Push' },
]

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Rascunho' },
  { value: 'scheduled', label: 'Agendada' },
  { value: 'running', label: 'Em Andamento' },
  { value: 'paused', label: 'Pausada' },
  { value: 'completed', label: 'Concluída' },
]

type Form = { name: string; channel: string; subject: string; content: string; status: string }
const EMPTY: Form = { name: '', channel: 'email', subject: '', content: '', status: 'draft' }

export default function CampanhasPage() {
  const pagination = usePagination()
  const { execute, data, isLoading } = useAsync(campaignsApi.list)
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<Campaign | null>(null)
  const [form, setForm] = useState<Form>(EMPTY)
  const [isSaving, setIsSaving] = useState(false)

  const load = useCallback(() => execute({ page: pagination.page, limit: pagination.limit }), [pagination.page])
  useEffect(() => { load() }, [pagination.page])
  useEffect(() => {
    if (data?.meta.total !== undefined) pagination.setTotal(data.meta.total, data.meta.totalPages)
  }, [data?.meta.total])

  const getChannel = (r: Campaign) => r.channel ?? r.type ?? ''

  const openCreate = () => { setForm(EMPTY); setEditing(null); setIsOpen(true) }
  const openEdit = (r: Campaign) => {
    setForm({ name: r.name, channel: getChannel(r), subject: r.subject ?? '', content: r.content ?? '', status: r.status })
    setEditing(r)
    setIsOpen(true)
  }
  const closeModal = () => { setIsOpen(false); setEditing(null) }

  const handleSubmit = async () => {
    setIsSaving(true)
    try {
      if (editing) await campaignsApi.update(editing.id, form as any)
      else await campaignsApi.create({ ...form, type: form.channel as any, audience_id: undefined })
      closeModal()
      load()
    } catch { /* stub */ } finally { setIsSaving(false) }
  }

  const cols: Column<Campaign>[] = [
    { key: 'name', header: 'Nome', render: (r) => <span className="font-medium text-white">{r.name}</span> },
    { key: 'channel', header: 'Canal', render: (r) => {
      const ch = getChannel(r)
      return ch ? <Badge variant="info" size="sm">{CHANNEL_LABELS[ch] ?? ch}</Badge> : '—'
    }},
    { key: 'sent_count', header: 'Enviados', render: (r) => String(r.sent_count ?? '—') },
    { key: 'open_count', header: 'Abertos', render: (r) => String(r.open_count ?? '—') },
    { key: 'click_count', header: 'Cliques', render: (r) => String(r.click_count ?? '—') },
    { key: 'scheduled_at', header: 'Agendado', render: (r) => r.scheduled_at ? formatDate(r.scheduled_at) : '—' },
    { key: 'status', header: 'Status', render: (r) => <CampaignStatusBadge status={r.status} /> },
    {
      key: 'updated_at' as keyof Campaign,
      header: '',
      width: '60px',
      render: (r) => (
        <button
          onClick={(e) => { e.stopPropagation(); openEdit(r) }}
          className="rounded-lg p-1.5 text-slate-500 hover:bg-white/8 hover:text-slate-200 transition"
          title="Editar"
        >
          <Pencil className="size-3.5" />
        </button>
      ),
    },
  ]

  return (
    <PageWrapper>
      <PageHeader
        title="Campanhas"
        description="Gerencie suas campanhas de comunicação"
        actions={[{ label: 'Nova Campanha', onClick: openCreate, icon: <Plus className="size-4" /> }]}
      />

      {!isLoading && data?.data.length === 0 ? (
        <EmptyState
          icon={<Megaphone className="size-8 text-slate-500" />}
          title="Nenhuma campanha"
          description="Crie sua primeira campanha para engajar clientes."
        />
      ) : (
        <DataTable<Campaign>
          title="Campanhas"
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
        onClose={closeModal}
        title={editing ? 'Editar Campanha' : 'Nova Campanha'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={closeModal}>Cancelar</Button>
            <Button variant="primary" size="sm" isLoading={isSaving} onClick={handleSubmit}>Salvar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nome da Campanha *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: E-mail de Boas Vindas" />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Canal"
              options={CHANNEL_OPTIONS}
              value={form.channel}
              onChange={e => setForm(f => ({ ...f, channel: e.target.value }))}
            />
            <Select
              label="Status"
              options={STATUS_OPTIONS}
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            />
          </div>
          <Input label="Assunto" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Ex: Bem-vindo à Innexar!" />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Conteúdo</label>
            <textarea
              rows={4}
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Escreva o conteúdo da campanha..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition hover:border-white/18 focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/15"
            />
          </div>
        </div>
      </Modal>
    </PageWrapper>
  )
}

