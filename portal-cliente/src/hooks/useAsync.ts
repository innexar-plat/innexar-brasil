import { useState, useEffect, useCallback, useRef } from 'react'

type AsyncStatus = 'idle' | 'loading' | 'success' | 'error'

interface AsyncState<T> {
  data: T | null
  error: string | null
  status: AsyncStatus
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
}

interface UseAsyncReturn<T> extends AsyncState<T> {
  execute: (...args: unknown[]) => Promise<void>
  reset: () => void
}

const INITIAL_STATE = {
  data: null,
  error: null,
  status: 'idle' as AsyncStatus,
  isLoading: false,
  isSuccess: false,
  isError: false,
}

/**
 * Generic hook for wrapping any async function with loading/error/data state.
 * @example
 * const { execute, data, isLoading, error } = useAsync(invoicesApi.list)
 * useEffect(() => { execute(1, 20) }, [execute])
 */
export function useAsync<T, A extends unknown[] = unknown[]>(
  asyncFn: (...args: A) => Promise<T>,
  immediate = false,
): Omit<UseAsyncReturn<T>, 'execute'> & { execute: (...args: A) => Promise<void>; reset: () => void } {
  const [state, setState] = useState<AsyncState<T>>(INITIAL_STATE)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  const execute = useCallback(
    async (...args: A) => {
      setState({ data: null, error: null, status: 'loading', isLoading: true, isSuccess: false, isError: false })
      try {
        const result = await asyncFn(...args)
        if (mountedRef.current) {
          setState({ data: result, error: null, status: 'success', isLoading: false, isSuccess: true, isError: false })
        }
      } catch (err) {
        if (mountedRef.current) {
          const message = err instanceof Error ? err.message : 'Erro desconhecido'
          setState({ data: null, error: message, status: 'error', isLoading: false, isSuccess: false, isError: true })
        }
      }
    },
    [asyncFn],
  )

  const reset = useCallback(() => setState(INITIAL_STATE), [])

  useEffect(() => {
    if (immediate) void (execute as () => Promise<void>)()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { ...state, execute, reset }
}
