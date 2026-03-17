'use client'

import { useEffect } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const locale = useLocale()

  useEffect(() => {
    console.error('Locale route error:', error)
  }, [error])

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">Algo salió mal</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Ha ocurrido un error al cargar esta página. Por favor, intente de nuevo.
      </p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Reintentar
        </button>
        <Link
          href={`/${locale}`}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Ir al inicio
        </Link>
      </div>
    </div>
  )
}
