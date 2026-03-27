import { useEffect } from 'react'
import { Package } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageWrapper, PageHeader } from '@/components/layout'
import { Card, CardHeader, Badge } from '@/components/ui'
import { EmptyState, Spinner } from '@/components/feedback'
import { useAsync } from '@/hooks/useAsync'
import { productsApi } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'
import type { Product } from '@/types'

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <Card hoverable className="flex h-full flex-col">
        <CardHeader
          title={product.name}
          description={product.description}
        />
        <div className="mt-auto flex items-center justify-between px-5 pb-5 pt-3 border-t border-white/5">
          <span className="text-xl font-bold text-white">{formatCurrency(product.price_cents / 100)}</span>
          <Badge variant={product.is_active ? 'success' : 'default'} dot>
            {product.is_active ? 'Disponível' : 'Indisponível'}
          </Badge>
        </div>
      </Card>
    </motion.div>
  )
}

export default function ProdutosPage() {
  const { execute, data, isLoading } = useAsync(productsApi.list)

  useEffect(() => {
    execute()
  }, [])

  return (
    <PageWrapper>
      <PageHeader title="Produtos" description="Catálogo de produtos e serviços disponíveis" />

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Spinner size="lg" />
        </div>
      ) : !data?.length ? (
        <EmptyState
          icon={<Package className="size-8 text-slate-500" />}
          title="Nenhum produto"
          description="Não há produtos disponíveis no momento."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}
    </PageWrapper>
  )
}
