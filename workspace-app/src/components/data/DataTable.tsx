import { type ReactNode } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/feedback/Spinner'
import { Button } from '@/components/ui'

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Column<T> {
  key: keyof T | string
  header: string
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (row: T) => ReactNode
}

export interface DataTableProps<T extends { id: string }> {
  title?: string
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  emptyMessage?: string
  page?: number
  totalPages?: number
  total?: number
  onPrev?: () => void
  onNext?: () => void
  canPrev?: boolean
  canNext?: boolean
  onRowClick?: (row: T) => void
}

// ─── Component ────────────────────────────────────────────────────────────────
export function DataTable<T extends { id: string }>({
  title,
  columns,
  data,
  isLoading = false,
  emptyMessage = 'Nenhum resultado encontrado.',
  page = 1,
  totalPages = 1,
  total,
  onPrev,
  onNext,
  canPrev = false,
  canNext = false,
  onRowClick,
}: DataTableProps<T>) {
  function getCellValue(row: T, col: Column<T>): ReactNode {
    if (col.render) return col.render(row)
    const val = (row as Record<string, unknown>)[col.key as string]
    return val !== undefined && val !== null ? String(val) : '—'
  }

  return (
    <div className="flex flex-col gap-0 overflow-hidden rounded-xl border border-white/8 bg-surface-2">
      {title && (
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {total !== undefined && <span className="text-xs text-slate-500">{total} itens</span>}
        </div>
      )}
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[500px] text-sm">
          {/* Head */}
          <thead>
            <tr className="border-b border-white/8 bg-white/3">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  style={col.width ? { width: col.width } : undefined}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right',
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <Spinner size="md" className="mx-auto" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center text-sm text-slate-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={row.id}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'border-b border-white/5 transition-colors duration-100 last:border-0',
                    onRowClick ? 'cursor-pointer hover:bg-white/4' : '',
                    i % 2 === 0 ? '' : 'bg-white/[0.015]',
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={cn(
                        'px-4 py-3 text-sm text-slate-300',
                        col.align === 'center' && 'text-center',
                        col.align === 'right' && 'text-right',
                      )}
                    >
                      {getCellValue(row, col)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {(onPrev || onNext) && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/8 px-4 py-3">
          <p className="text-xs text-slate-500">
            Página <span className="text-slate-300">{page}</span> de{' '}
            <span className="text-slate-300">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="xs"
              disabled={!canPrev}
              onClick={onPrev}
              leftIcon={<ChevronLeft className="size-3.5" />}
            >
              Anterior
            </Button>
            <Button
              variant="ghost"
              size="xs"
              disabled={!canNext}
              onClick={onNext}
              rightIcon={<ChevronRight className="size-3.5" />}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
