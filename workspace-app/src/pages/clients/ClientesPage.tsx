import { useState, useEffect, useCallback } from 'react'
import { Users, Plus, Pencil } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { DataTable } from '@/components/data'
import type { Column } from '@/components/data'
import { Badge, Button, Input, Modal, Select } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { useAsync } from '@/hooks/useAsync'
import { usePagination } from '@/hooks/usePagination'
import { customersApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Customer } from '@/types'

function displayName(r: Customer): string {
  return (r.name ?? [r.first_name, r.last_name].filter(Boolean).join(' ')) || '—'
}

function isActive(r: Customer): boolean {
  return r.status === 'active' || r.is_active === true
}

type Form = { first_name: string; last_name: string; email: string; phone: string; document: string; status: string }
const EMPTY: Form = { first_name: '', last_name: '', email: '', phone: '', document: '', status: 'active' }

export default function ClientesPage() {
  const pagination = usePagination()
  const { execute, data, isLoading } = useAsync(customersApi.list)
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [form, setForm] = useState<Form>(EMPTY)
  const [isSaving, setIsSaving] = useState(false)

  const load = useCallback(() => execute({ page: pagination.page, limit: pagination.limit }), [pagination.page])
  useEffect(() => { load() }, [pagination.page])
  useEffect(() => {
    if (data?.meta.total !== undefined) pagination.setTotal(data.meta.total, data.meta.totalPages)
  }, [data?.meta.total])

  const openCreate = () => { setForm(EMPTY); setEditing(null); setIsOpen(true) }
  const openEdit = (r: Customer) => {
    const parts = (r.name ?? '').split(' ')
    setForm({
      first_name: r.first_name ?? parts[0] ?? '',
      last_name: r.last_name ?? parts.slice(1).join(' ') ?? '',
      email: r.email,
      phone: r.phone ?? '',
      document: r.document ?? '',
      status: isActive(r) ? 'active' : 'inactive',
    })
    setEditing(r)
    setIsOpen(true)
  }
  const closeModal = () => { setIsOpen(false); setEditing(null) }

  const handleSubmit = async () => {
    setIsSaving(true)
    try {
      if (editing) await customersApi.update(editing.id, form as any)
      else await customersApi.create(form as any)
      closeModal()
      load()
    } catch { /* stub */ } finally { setIsSaving(false) }
  }

  const cols: Column<Customer>[] = [
    { key: 'email', header: 'Nome', render: (r) => <span className="font-medium text-white">{displayName(r)}</span> },
    { key: 'phone', header: 'E-mail', render: (r) => r.email },
    { key: 'document', header: 'Telefone', render: (r) => r.phone ?? '—' },
    { key: 'is_active', header: 'CPF/CNPJ', render: (r) => r.document ?? '—' },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={isActive(r) ? 'success' : 'default'} dot size="sm">{isActive(r) ? 'Ativo' : 'Inativo'}</Badge> },
    { key: 'created_at', header: 'Desde', render: (r) => formatDate(r.created_at) },
    {
      key: 'updated_at' as keyof Customer,
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
        title="Clientes"
        description="Base de clientes da plataforma"
        actions={[{ label: 'Novo Cliente', onClick: openCreate, icon: <Plus className="size-4" /> }]}
      />

      {!isLoading && data?.data.length === 0 ? (
        <EmptyState
          icon={<Users className="size-8 text-slate-500" />}
          title="Nenhum cliente"
          description="Nenhum cliente cadastrado ainda."
        />
      ) : (
        <DataTable<Customer>
          title="Clientes"
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
        title={editing ? 'Editar Cliente' : 'Novo Cliente'}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={closeModal}>Cancelar</Button>
            <Button variant="primary" size="sm" isLoading={isSaving} onClick={handleSubmit}>Salvar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nome *" value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} placeholder="Primeiro nome" />
            <Input label="Sobrenome" value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} placeholder="Sobrenome" />
          </div>
          <Input label="E-mail *" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="cliente@email.com" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Telefone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+55 11 9xxxx-xxxx" />
            <Input label="CPF/CNPJ" value={form.document} onChange={e => setForm(f => ({ ...f, document: e.target.value }))} placeholder="000.000.000-00" />
          </div>
          <Select
            label="Status"
            options={[
              { value: 'active', label: 'Ativo' },
              { value: 'inactive', label: 'Inativo' },
            ]}
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
          />
        </div>
      </Modal>
    </PageWrapper>
  )
}
