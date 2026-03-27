import { useState, useEffect, useCallback } from 'react'
import { FileText, Plus, Pencil } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { DataTable, TemplateStatusBadge } from '@/components/data'
import type { Column } from '@/components/data'
import { Badge, Button, Input, Modal, Select } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { useAsync } from '@/hooks/useAsync'
import { usePagination } from '@/hooks/usePagination'
import { templatesApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Template } from '@/types'

const CHANNEL_LABELS: Record<string, string> = {
  email: 'E-mail',
  whatsapp: 'WhatsApp',
  sms: 'SMS',
  push: 'Push',
}

const CATEGORY_LABELS: Record<string, string> = {
  marketing: 'Marketing',
  utility: 'Utilitário',
  authentication: 'Autenticação',
}

const CHANNEL_OPTIONS = [
  { value: 'email', label: 'E-mail' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'sms', label: 'SMS' },
  { value: 'push', label: 'Push' },
]

const CATEGORY_OPTIONS = [
  { value: 'marketing', label: 'Marketing' },
  { value: 'utility', label: 'Utilitário' },
  { value: 'authentication', label: 'Autenticação' },
]

type Form = { name: string; channel: string; category: string; language: string; content: string }
const EMPTY: Form = { name: '', channel: 'whatsapp', category: 'marketing', language: 'pt_BR', content: '' }

export default function TemplatesPage() {
  const pagination = usePagination()
  const { execute, data, isLoading } = useAsync(templatesApi.list)
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<Template | null>(null)
  const [form, setForm] = useState<Form>(EMPTY)
  const [isSaving, setIsSaving] = useState(false)

  const load = useCallback(() => execute({ page: pagination.page, limit: pagination.limit }), [pagination.page])
  useEffect(() => { load() }, [pagination.page])
  useEffect(() => {
    if (data?.meta.total !== undefined) pagination.setTotal(data.meta.total, data.meta.totalPages)
  }, [data?.meta.total])

  const getChannel = (r: Template) => r.channel ?? r.channel_type ?? ''

  const openCreate = () => { setForm(EMPTY); setEditing(null); setIsOpen(true) }
  const openEdit = (r: Template) => {
    setForm({ name: r.name, channel: getChannel(r), category: r.category ?? 'marketing', language: r.language ?? 'pt_BR', content: r.content })
    setEditing(r)
    setIsOpen(true)
  }
  const closeModal = () => { setIsOpen(false); setEditing(null) }

  const handleSubmit = async () => {
    setIsSaving(true)
    try {
      if (editing) await templatesApi.update(editing.id, form as any)
      else await templatesApi.create({ ...form, category: form.category as any, channel_type: form.channel as any })
      closeModal()
      load()
    } catch { /* stub */ } finally { setIsSaving(false) }
  }

  const cols: Column<Template>[] = [
    { key: 'name', header: 'Nome', render: (r) => <span className="font-medium text-white">{r.name}</span> },
    { key: 'channel', header: 'Canal', render: (r) => {
      const ch = getChannel(r)
      return ch ? <Badge variant="info" size="sm">{CHANNEL_LABELS[ch] ?? ch}</Badge> : '—'
    }},
    { key: 'category', header: 'Categoria', render: (r) => CATEGORY_LABELS[r.category ?? ''] ?? r.category ?? '—' },
    { key: 'language', header: 'Idioma', render: (r) => r.language ?? '—' },
    { key: 'status', header: 'Status', render: (r) => <TemplateStatusBadge status={r.status} /> },
    { key: 'created_at', header: 'Criado em', render: (r) => formatDate(r.created_at) },
    {
      key: 'updated_at' as keyof Template,
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
        title="Templates"
        description="Modelos de mensagem para campanhas e automações"
        actions={[{ label: 'Novo Template', onClick: openCreate, icon: <Plus className="size-4" /> }]}
      />

      {!isLoading && data?.data.length === 0 ? (
        <EmptyState
          icon={<FileText className="size-8 text-slate-500" />}
          title="Nenhum template"
          description="Crie modelos de mensagem reutilizáveis."
        />
      ) : (
        <DataTable<Template>
          title="Templates"
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
        title={editing ? 'Editar Template' : 'Novo Template'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={closeModal}>Cancelar</Button>
            <Button variant="primary" size="sm" isLoading={isSaving} onClick={handleSubmit}>Salvar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nome *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Boas-vindas WhatsApp" />
          <div className="grid grid-cols-3 gap-4">
            <Select
              label="Canal"
              options={CHANNEL_OPTIONS}
              value={form.channel}
              onChange={e => setForm(f => ({ ...f, channel: e.target.value }))}
            />
            <Select
              label="Categoria"
              options={CATEGORY_OPTIONS}
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            />
            <Input label="Idioma" value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} placeholder="pt_BR" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-400">Conteúdo *</label>
            <textarea
              rows={5}
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder="Olá {{1}}, bem-vindo!"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder-slate-500 outline-none transition hover:border-white/18 focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/15"
            />
            <p className="text-xs text-slate-500">Use {'{{1}}'}, {'{{2}}'} etc. para variáveis dinâmicas</p>
          </div>
        </div>
      </Modal>
    </PageWrapper>
  )
}

