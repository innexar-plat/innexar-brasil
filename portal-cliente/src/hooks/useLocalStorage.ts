import { useState, useCallback, useEffect } from 'react'

/**
 * Syncs state with localStorage. Handles serialization and SSR-safe init.
 */
export function useLocalStorage<T>(key: string, defaultValue: T): [T, (val: T | ((prev: T) => T)) => void, () => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored !== null ? (JSON.parse(stored) as T) : defaultValue
    } catch {
      return defaultValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage might be full or blocked
    }
  }, [key, value])

  const remove = useCallback(() => {
    localStorage.removeItem(key)
    setValue(defaultValue)
  }, [key, defaultValue])

  return [value, setValue, remove]
}
