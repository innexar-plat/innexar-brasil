import { useEffect, useCallback } from 'react'
import { Users } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { DataTable } from '@/components/data'
import type { Column } from '@/components/data'
import { Badge } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { useAsync } from '@/hooks/useAsync'
import { usePagination } from '@/hooks/usePagination'
import { contactsApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Contact } from '@/types'

const cols: Column<Contact>[] = [
  { key: 'name', header: 'Nome', render: (r) => <span className="font-medium text-white">{r.name}</span> },
  { key: 'email', header: 'E-mail', render: (r) => r.email ?? '—' },
  { key: 'phone', header: 'Telefone', render: (r) => r.phone ?? '—' },
  { key: 'company', header: 'Empresa', render: (r) => r.company ?? '—' },
  { key: 'position', header: 'Cargo', render: (r) => r.position ?? '—' },
  { key: 'is_active', header: 'Status', render: (r) => <Badge variant={r.is_active ? 'success' : 'default'} dot size="sm">{r.is_active ? 'Ativo' : 'Inativo'}</Badge> },
  { key: 'created_at', header: 'Criado em', render: (r) => formatDate(r.created_at) },
]

export default function ContactsPage() {
  const pagination = usePagination()
  const { execute, data, isLoading } = useAsync(contactsApi.list)

  const load = useCallback(() => execute({ page: pagination.page, limit: pagination.limit }), [pagination.page])

  useEffect(() => { load() }, [pagination.page])
  useEffect(() => { if (data?.meta.total !== undefined) pagination.setTotal(data.meta.total, data.meta.totalPages) }, [data?.meta.total])

  return (
    <PageWrapper>
      <PageHeader title="Contatos" description="Base de contatos e relacionamentos" />

      {!isLoading && data?.data.length === 0 ? (
        <EmptyState icon={<Users className="size-8 text-slate-500" />} title="Nenhum contato" description="Adicione contatos à sua base." />
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
    </PageWrapper>
  )
}
