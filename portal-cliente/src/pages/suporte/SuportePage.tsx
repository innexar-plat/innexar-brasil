import { useState, useEffect } from 'react'
import { Headset, Plus } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { DataTable, TicketStatusBadge, TicketPriorityBadge } from '@/components/data'
import type { Column } from '@/components/data'
import { Button, Input, Select, Modal } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { useAsync } from '@/hooks/useAsync'
import { ticketsApi } from '@/lib/api'
import { useToast } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'
import type { Ticket, TicketPriority } from '@/types'

const PRIORITY_OPTIONS = [
  { value: 'low',      label: 'Baixa' },
  { value: 'medium',   label: 'Média' },
  { value: 'high',     label: 'Alta' },
  { value: 'critical', label: 'Crítica' },
]

const cols: Column<Ticket>[] = [
  {
    key: 'title',
    header: 'Assunto',
    render: (r) => <span className="font-medium text-white">{r.title}</span>,
  },
  {
    key: 'priority',
    header: 'Prioridade',
    render: (r) => <TicketPriorityBadge priority={r.priority} />,
  },
  {
    key: 'status',
    header: 'Status',
    render: (r) => <TicketStatusBadge status={r.status} />,
  },
]

export default function SuportePage() {
  const { execute, data, isLoading } = useAsync(ticketsApi.list)
  const createAsync = useAsync(ticketsApi.create)
  const toast = useToast()
  const { user } = useAuth()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<TicketPriority>('medium')

  useEffect(() => {
    execute()
  }, [])

  async function handleCreate() {
    if (!title.trim()) return
    try {
      await createAsync.execute({
        customer_id: user?.id ?? '',
        title: title.trim(),
        priority,
        status: 'open',
      })
      toast.success('Ticket criado com sucesso!')
      setIsModalOpen(false)
      setTitle('')
      setPriority('medium')
      execute()
    } catch {
      toast.error('Erro ao criar ticket. Tente novamente.')
    }
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Suporte"
        description="Gerencie seus tickets de atendimento"
        actions={[
          {
            label: 'Novo Ticket',
            icon: <Plus className="size-4" />,
            onClick: () => setIsModalOpen(true),
          },
        ]}
      />

      {!isLoading && data?.length === 0 ? (
        <EmptyState
          icon={<Headset className="size-8 text-slate-500" />}
          title="Nenhum ticket"
          description="Você não abriu nenhum chamado ainda."
          action={{ label: 'Abrir Ticket', onClick: () => setIsModalOpen(true) }}
        />
      ) : (
        <DataTable<Ticket>
          title="Meus Tickets"
          columns={cols}
          data={data ?? []}
          isLoading={isLoading}
          page={1}
          totalPages={1}
          total={data?.length ?? 0}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Abrir Novo Ticket"
        description="Descreva seu problema e nossa equipe entrará em contato."
        footer={
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              isLoading={createAsync.isLoading}
              onClick={handleCreate}
              disabled={!title.trim()}
            >
              Enviar
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <Input
            label="Assunto"
            placeholder="Ex: Erro ao acessar o sistema"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Select
            label="Prioridade"
            options={PRIORITY_OPTIONS}
            value={priority}
            onChange={(e) => setPriority(e.target.value as TicketPriority)}
          />
        </div>
      </Modal>
    </PageWrapper>
  )
}
