import { useState, useCallback } from 'react'

interface PaginationState {
  page: number
  limit: number
  totalPages: number
  total: number
}

interface UsePaginationReturn extends PaginationState {
  setPage: (page: number) => void
  setTotal: (total: number, totalPages: number) => void
  nextPage: () => void
  prevPage: () => void
  canNext: boolean
  canPrev: boolean
  resetPage: () => void
}

/**
 * Manages pagination state for any list/table.
 * Pair with useAsync to drive API calls.
 */
export function usePagination(initialLimit = 20): UsePaginationReturn {
  const [state, setState] = useState<PaginationState>({
    page: 1,
    limit: initialLimit,
    totalPages: 1,
    total: 0,
  })

  const setPage = useCallback((page: number) => {
    setState((s) => ({ ...s, page }))
  }, [])

  const setTotal = useCallback((total: number, totalPages: number) => {
    setState((s) => ({ ...s, total, totalPages }))
  }, [])

  const nextPage = useCallback(() => {
    setState((s) => ({ ...s, page: Math.min(s.page + 1, s.totalPages) }))
  }, [])

  const prevPage = useCallback(() => {
    setState((s) => ({ ...s, page: Math.max(s.page - 1, 1) }))
  }, [])

  const resetPage = useCallback(() => {
    setState((s) => ({ ...s, page: 1 }))
  }, [])

  return {
    ...state,
    setPage,
    setTotal,
    nextPage,
    prevPage,
    canNext: state.page < state.totalPages,
    canPrev: state.page > 1,
    resetPage,
  }
}
