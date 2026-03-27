import { useState, useEffect, useCallback } from 'react'
import { TrendingUp, Plus, Pencil } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { DataTable } from '@/components/data'
import type { Column } from '@/components/data'
import { EmptyState } from '@/components/feedback'
import { Badge, Button, Input, Modal, Select } from '@/components/ui'
import { useAsync } from '@/hooks/useAsync'
import { usePagination } from '@/hooks/usePagination'
import { crmApi } from '@/lib/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Deal } from '@/types'

const STATUS_VARIANTS = {
  open: 'brand',
  won: 'success',
  lost: 'danger',
  on_hold: 'warning',
} as const

const STATUS_LABELS: Record<string, string> = {
  open: 'Aberto',
  won: 'Ganho',
  lost: 'Perdido',
  on_hold: 'Em Espera',
}

const STATUS_OPTIONS = [
  { value: 'open', label: 'Aberto' },
  { value: 'won', label: 'Ganho' },
  { value: 'lost', label: 'Perdido' },
  { value: 'on_hold', label: 'Em Espera' },
]

const STAGE_OPTIONS = [
  { value: 'st_prospecting', label: 'Prospecção' },
  { value: 'st_qualification', label: 'Qualificação' },
  { value: 'st_proposal', label: 'Proposta' },
  { value: 'st_negotiation', label: 'Negociação' },
  { value: 'st_closing', label: 'Fechamento' },
]

type Form = { title: string; value: string; stage_id: string; status: string; closing_date: string }
const EMPTY: Form = { title: '', value: '', stage_id: 'st_prospecting', status: 'open', closing_date: '' }

export default function CrmPage() {
  const pagination = usePagination()
  const { execute, data, isLoading } = useAsync(crmApi.list)
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<Deal | null>(null)
  const [form, setForm] = useState<Form>(EMPTY)
  const [isSaving, setIsSaving] = useState(false)

  const load = useCallback(() => execute({ page: pagination.page, limit: pagination.limit }), [pagination.page])
  useEffect(() => { load() }, [pagination.page])
  useEffect(() => {
    if (data?.meta.total !== undefined) pagination.setTotal(data.meta.total, data.meta.totalPages)
  }, [data?.meta.total])

  const openCreate = () => { setForm(EMPTY); setEditing(null); setIsOpen(true) }
  const openEdit = (r: Deal) => {
    setForm({ title: r.title, value: String(r.value ?? ''), stage_id: r.stage_id ?? 'st_prospecting', status: r.status, closing_date: r.closing_date ?? '' })
    setEditing(r)
    setIsOpen(true)
  }
  const closeModal = () => { setIsOpen(false); setEditing(null) }

  const handleSubmit = async () => {
    setIsSaving(true)
    try {
      const payload = { ...form, value: form.value ? parseFloat(form.value) : undefined, closing_date: form.closing_date || undefined }
      if (editing) await crmApi.update(editing.id, payload as any)
      else await crmApi.create(payload as any)
      closeModal()
      load()
    } catch { /* stub */ } finally { setIsSaving(false) }
  }

  const cols: Column<Deal>[] = [
    { key: 'title', header: 'Negócio', render: (r) => <span className="font-medium text-white">{r.title}</span> },
    { key: 'value', header: 'Valor', render: (r) => r.value != null ? formatCurrency(r.value) : '—' },
    { key: 'stage_id', header: 'Etapa', render: (r) => {
      const stage = STAGE_OPTIONS.find(s => s.value === r.stage_id)
      return stage?.label ?? r.stage_id ?? '—'
    }},
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <Badge variant={STATUS_VARIANTS[r.status] ?? 'default'} dot size="sm">
          {STATUS_LABELS[r.status] ?? r.status}
        </Badge>
      ),
    },
    { key: 'closing_date', header: 'Previsão Fechamento', render: (r) => r.closing_date ? formatDate(r.closing_date) : '—' },
    { key: 'created_at', header: 'Criado em', render: (r) => formatDate(r.created_at) },
    {
      key: 'lead_id' as keyof Deal,
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
        title="CRM"
        description="Pipeline de negócios e oportunidades"
        actions={[{ label: 'Novo Negócio', onClick: openCreate, icon: <Plus className="size-4" /> }]}
      />

      {!isLoading && data?.data.length === 0 ? (
        <EmptyState
          icon={<TrendingUp className="size-8 text-slate-500" />}
          title="Nenhum negócio"
          description="Comece adicionando negócios ao seu pipeline."
        />
      ) : (
        <DataTable<Deal>
          title="Negócios"
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
        title={editing ? 'Editar Negócio' : 'Novo Negócio'}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={closeModal}>Cancelar</Button>
            <Button variant="primary" size="sm" isLoading={isSaving} onClick={handleSubmit}>Salvar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Título *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Ex: Contrato Anual XYZ" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Valor (R$)" type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder="0,00" />
            <Input label="Data de Fechamento" type="date" value={form.closing_date} onChange={e => setForm(f => ({ ...f, closing_date: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Etapa"
              options={STAGE_OPTIONS}
              value={form.stage_id}
              onChange={e => setForm(f => ({ ...f, stage_id: e.target.value }))}
            />
            <Select
              label="Status"
              options={STATUS_OPTIONS}
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
            />
          </div>
        </div>
      </Modal>
    </PageWrapper>
  )
}

