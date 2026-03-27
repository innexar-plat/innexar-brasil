import { useEffect, useCallback } from 'react'
import { Users } from 'lucide-react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { DataTable } from '@/components/data'
import type { Column } from '@/components/data'
import { Badge } from '@/components/ui'
import { EmptyState } from '@/components/feedback'
import { useAsync } from '@/hooks/useAsync'
import { usePagination } from '@/hooks/usePagination'
import { customersApi } from '@/lib/api'
import { formatDate } from '@/lib/utils'
import type { Customer } from '@/types'

const cols: Column<Customer>[] = [
  { key: 'name', header: 'Nome', render: (r) => <span className="font-medium text-white">{r.name}</span> },
  { key: 'email', header: 'E-mail', render: (r) => r.email },
  { key: 'phone', header: 'Telefone', render: (r) => r.phone ?? '—' },
  { key: 'document', header: 'CPF/CNPJ', render: (r) => r.document ?? '—' },
  { key: 'is_active', header: 'Status', render: (r) => <Badge variant={r.is_active ? 'success' : 'default'} dot size="sm">{r.is_active ? 'Ativo' : 'Inativo'}</Badge> },
  { key: 'created_at', header: 'Desde', render: (r) => formatDate(r.created_at) },
]

export default function ClientesPage() {
  const pagination = usePagination()
  const { execute, data, isLoading } = useAsync(customersApi.list)

  const load = useCallback(() => execute({ page: pagination.page, limit: pagination.limit }), [pagination.page])

  useEffect(() => { load() }, [pagination.page])
  useEffect(() => { if (data?.meta.total !== undefined) pagination.setTotal(data.meta.total, data.meta.totalPages) }, [data?.meta.total])

  return (
    <PageWrapper>
      <PageHeader title="Clientes" description="Base de clientes da plataforma" />

      {!isLoading && data?.data.length === 0 ? (
        <EmptyState icon={<Users className="size-8 text-slate-500" />} title="Nenhum cliente" description="Nenhum cliente cadastrado ainda." />
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
    </PageWrapper>
  )
}
