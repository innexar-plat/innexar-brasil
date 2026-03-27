import { useState, useEffect, useCallback } from 'react'
import { TicketCheck, Plus, Pencil } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { DataTable, TicketStatusBadge, TicketPriorityBadge } from '@/components/data'
import type { Column } from '@/components/data'
import { Button, Input, Modal, Select } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { useAsync } from '@/hooks/useAsync'
import { usePagination } from '@/hooks/usePagination'
import { ticketsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Ticket, TicketPriority, TicketStatus } from '@/types'

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
  { value: 'urgent', label: 'Urgente' },
]

const STATUS_OPTIONS = [
  { value: 'open', label: 'Aberto' },
  { value: 'in_progress', label: 'Em Andamento' },
  { value: 'resolved', label: 'Resolvido' },
  { value: 'closed', label: 'Fechado' },
]

type Form = { title: string; customer_id: string; priority: string; status: string }
const EMPTY: Form = { title: '', customer_id: '', priority: 'medium', status: 'open' }

export default function TicketsPage() {
  const pagination = usePagination()
  const { execute, data, isLoading } = useAsync(ticketsApi.list)
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<Ticket | null>(null)
  const [form, setForm] = useState<Form>(EMPTY)
  const [isSaving, setIsSaving] = useState(false)

  const load = useCallback(() => execute({ page: pagination.page, limit: pagination.limit }), [pagination.page])
  useEffect(() => { load() }, [pagination.page])
  useEffect(() => {
    if (data?.meta.total !== undefined) pagination.setTotal(data.meta.total, data.meta.totalPages)
  }, [data?.meta.total])

  const getTitle = (r: Ticket) => r.title ?? r.subject ?? '—'

  const openCreate = () => { setForm(EMPTY); setEditing(null); setIsOpen(true) }
  const openEdit = (r: Ticket) => {
    setForm({ title: getTitle(r), customer_id: r.customer_id ?? '', priority: r.priority, status: r.status })
    setEditing(r)
    setIsOpen(true)
  }
  const closeModal = () => { setIsOpen(false); setEditing(null) }

  const handleSubmit = async () => {
    setIsSaving(true)
    try {
      if (editing) await ticketsApi.update(editing.id, { title: form.title, subject: form.title, priority: form.priority as TicketPriority, status: form.status as TicketStatus })
      else await ticketsApi.create({ title: form.title, subject: form.title, customer_id: form.customer_id || undefined, priority: form.priority as TicketPriority })
      closeModal()
      load()
    } catch { /* stub */ } finally { setIsSaving(false) }
  }

  const cols: Column<Ticket>[] = [
    { key: 'title', header: 'Assunto', render: (r) => <span className="font-medium text-white">{getTitle(r)}</span> },
    { key: 'customer_id', header: 'Cliente', render: (r) => r.customer?.name ?? r.customer_id ?? '—' },
    { key: 'priority', header: 'Prioridade', render: (r) => <TicketPriorityBadge priority={r.priority} /> },
    { key: 'assigned_to', header: 'Atribuído a', render: (r) => r.assigned_to ?? '—' },
    { key: 'created_at', header: 'Criado em', render: (r) => formatDate(r.created_at) },
    { key: 'status', header: 'Status', render: (r) => <TicketStatusBadge status={r.status} /> },
    {
      key: 'updated_at' as keyof Ticket,
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
        title="Tickets"
        description="Chamados de suporte e atendimento"
        actions={[{ label: 'Novo Ticket', onClick: openCreate, icon: <Plus className="size-4" /> }]}
      />

      {!isLoading && data?.data.length === 0 ? (
        <EmptyState
          icon={<TicketCheck className="size-8 text-slate-500" />}
          title="Nenhum ticket"
          description="Não há tickets de suporte no momento."
        />
      ) : (
        <DataTable<Ticket>
          title="Tickets de Suporte"
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
        title={editing ? 'Editar Ticket' : 'Novo Ticket'}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={closeModal}>Cancelar</Button>
            <Button variant="primary" size="sm" isLoading={isSaving} onClick={handleSubmit}>Salvar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Assunto *"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Descreva o problema brevemente"
          />
          <Input
            label="ID do Cliente"
            value={form.customer_id}
            onChange={e => setForm(f => ({ ...f, customer_id: e.target.value }))}
            placeholder="UUID do cliente (opcional)"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Prioridade"
              options={PRIORITY_OPTIONS}
              value={form.priority}
              onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
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

