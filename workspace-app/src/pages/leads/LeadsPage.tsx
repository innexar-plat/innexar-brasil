import { useState, useEffect, useCallback } from 'react'
import { UserCircle, Plus, Pencil } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { DataTable, LeadStatusBadge } from '@/components/data'
import type { Column } from '@/components/data'
import { Button, Input, Modal, Select } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { useAsync } from '@/hooks/useAsync'
import { usePagination } from '@/hooks/usePagination'
import { leadsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Lead } from '@/types'

const SOURCE_OPTIONS = [
  { value: 'website', label: 'Site' },
  { value: 'referral', label: 'Indicação' },
  { value: 'social', label: 'Redes Sociais' },
  { value: 'ads', label: 'Anúncio' },
  { value: 'event', label: 'Evento' },
  { value: 'cold_call', label: 'Cold Call' },
  { value: 'other', label: 'Outro' },
]

const STATUS_OPTIONS = [
  { value: 'new', label: 'Novo' },
  { value: 'contacted', label: 'Contatado' },
  { value: 'qualified', label: 'Qualificado' },
  { value: 'proposal', label: 'Proposta' },
  { value: 'won', label: 'Ganho' },
  { value: 'lost', label: 'Perdido' },
]

type Form = { name: string; email: string; phone: string; company: string; source: string; status: string }
const EMPTY: Form = { name: '', email: '', phone: '', company: '', source: 'website', status: 'new' }

export default function LeadsPage() {
  const pagination = usePagination()
  const { execute, data, isLoading } = useAsync(leadsApi.list)
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<Lead | null>(null)
  const [form, setForm] = useState<Form>(EMPTY)
  const [isSaving, setIsSaving] = useState(false)

  const load = useCallback(() => execute({ page: pagination.page, limit: pagination.limit }), [pagination.page])
  useEffect(() => { load() }, [pagination.page])
  useEffect(() => {
    if (data?.meta.total !== undefined) pagination.setTotal(data.meta.total, data.meta.totalPages)
  }, [data?.meta.total])

  const openCreate = () => { setForm(EMPTY); setEditing(null); setIsOpen(true) }
  const openEdit = (r: Lead) => {
    setForm({ name: r.name, email: r.email, phone: r.phone ?? '', company: r.company ?? '', source: r.source ?? 'website', status: r.status })
    setEditing(r)
    setIsOpen(true)
  }
  const closeModal = () => { setIsOpen(false); setEditing(null) }

  const handleSubmit = async () => {
    setIsSaving(true)
    try {
      if (editing) await leadsApi.update(editing.id, form as any)
      else await leadsApi.create(form as any)
      closeModal()
      load()
    } catch { /* stub data — ignore errors */ } finally { setIsSaving(false) }
  }

  const cols: Column<Lead>[] = [
    { key: 'name', header: 'Nome', render: (r) => <span className="font-medium text-white">{r.name}</span> },
    { key: 'email', header: 'E-mail', render: (r) => r.email },
    { key: 'company', header: 'Empresa', render: (r) => r.company ?? '—' },
    { key: 'source', header: 'Origem', render: (r) => r.source ?? '—' },
    { key: 'score', header: 'Score', render: (r) => r.score !== undefined ? <span className="font-mono">{r.score}</span> : '—' },
    { key: 'status', header: 'Status', render: (r) => <LeadStatusBadge status={r.status} /> },
    { key: 'created_at', header: 'Criado em', render: (r) => formatDate(r.created_at) },
    {
      key: 'updated_at' as keyof Lead,
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
        title="Leads"
        description="Gerencie seus leads e prospects"
        actions={[{ label: 'Novo Lead', onClick: openCreate, icon: <Plus className="size-4" /> }]}
      />

      {!isLoading && data?.data.length === 0 ? (
        <EmptyState
          icon={<UserCircle className="size-8 text-slate-500" />}
          title="Nenhum lead"
          description="Adicione leads para começar a prospectar."
        />
      ) : (
        <DataTable<Lead>
          title="Leads"
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
        title={editing ? 'Editar Lead' : 'Novo Lead'}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={closeModal}>Cancelar</Button>
            <Button variant="primary" size="sm" isLoading={isSaving} onClick={handleSubmit}>Salvar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nome *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome completo" />
            <Input label="E-mail *" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="lead@empresa.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Telefone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+55 11 9xxxx-xxxx" />
            <Input label="Empresa" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Nome da empresa" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Origem"
              options={SOURCE_OPTIONS}
              value={form.source}
              onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
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
