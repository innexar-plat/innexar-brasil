import { useState, useEffect, useCallback } from 'react'
import { Users, Plus, Pencil } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { DataTable } from '@/components/data'
import type { Column } from '@/components/data'
import { Badge, Button, Input, Modal, Select } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { useAsync } from '@/hooks/useAsync'
import { usePagination } from '@/hooks/usePagination'
import { contactsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Contact } from '@/types'

type Form = { name: string; email: string; phone: string; company: string; position: string; status: string }
const EMPTY: Form = { name: '', email: '', phone: '', company: '', position: '', status: 'active' }

export default function ContactsPage() {
  const pagination = usePagination()
  const { execute, data, isLoading } = useAsync(contactsApi.list)
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState<Contact | null>(null)
  const [form, setForm] = useState<Form>(EMPTY)
  const [isSaving, setIsSaving] = useState(false)

  const load = useCallback(() => execute({ page: pagination.page, limit: pagination.limit }), [pagination.page])
  useEffect(() => { load() }, [pagination.page])
  useEffect(() => {
    if (data?.meta.total !== undefined) pagination.setTotal(data.meta.total, data.meta.totalPages)
  }, [data?.meta.total])

  const isActive = (r: Contact) => r.status === 'active' || r.is_active === true

  const openCreate = () => { setForm(EMPTY); setEditing(null); setIsOpen(true) }
  const openEdit = (r: Contact) => {
    setForm({ name: r.name, email: r.email ?? '', phone: r.phone ?? '', company: r.company ?? '', position: r.position ?? '', status: isActive(r) ? 'active' : 'inactive' })
    setEditing(r)
    setIsOpen(true)
  }
  const closeModal = () => { setIsOpen(false); setEditing(null) }

  const handleSubmit = async () => {
    setIsSaving(true)
    try {
      if (editing) await contactsApi.update(editing.id, form as any)
      else await contactsApi.create(form as any)
      closeModal()
      load()
    } catch { /* stub */ } finally { setIsSaving(false) }
  }

  const cols: Column<Contact>[] = [
    { key: 'name', header: 'Nome', render: (r) => <span className="font-medium text-white">{r.name}</span> },
    { key: 'email', header: 'E-mail', render: (r) => r.email ?? '—' },
    { key: 'phone', header: 'Telefone', render: (r) => r.phone ?? '—' },
    { key: 'company', header: 'Empresa', render: (r) => r.company ?? '—' },
    { key: 'position', header: 'Cargo', render: (r) => r.position ?? '—' },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={isActive(r) ? 'success' : 'default'} dot size="sm">{isActive(r) ? 'Ativo' : 'Inativo'}</Badge> },
    { key: 'created_at', header: 'Criado em', render: (r) => formatDate(r.created_at) },
    {
      key: 'updated_at' as keyof Contact,
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
        title="Contatos"
        description="Base de contatos e relacionamentos"
        actions={[{ label: 'Novo Contato', onClick: openCreate, icon: <Plus className="size-4" /> }]}
      />

      {!isLoading && data?.data.length === 0 ? (
        <EmptyState
          icon={<Users className="size-8 text-slate-500" />}
          title="Nenhum contato"
          description="Adicione contatos à sua base."
        />
      ) : (
        <DataTable<Contact>
          title="Contatos"
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
        title={editing ? 'Editar Contato' : 'Novo Contato'}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={closeModal}>Cancelar</Button>
            <Button variant="primary" size="sm" isLoading={isSaving} onClick={handleSubmit}>Salvar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Nome *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nome completo" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="E-mail" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="contato@empresa.com" />
            <Input label="Telefone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+55 11 9xxxx-xxxx" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Empresa" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="Nome da empresa" />
            <Input label="Cargo" value={form.position} onChange={e => setForm(f => ({ ...f, position: e.target.value }))} placeholder="Ex: Diretor Comercial" />
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
