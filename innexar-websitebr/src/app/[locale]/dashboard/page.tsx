'use client'

import { useEffect } from 'react'
import { useLocale } from 'next-intl'

const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.innexar.com.br"

/**
 * Legacy dashboard page - redirects to portal (external app)
 */
export default function DashboardPage() {
    const locale = useLocale()

    useEffect(() => {
        const token = localStorage.getItem('customer_token')
        const email = localStorage.getItem('customer_email')

        if (!token || !email) {
            window.location.href = `${PORTAL_URL}/${locale}/login`
            return
        }
        window.location.href = `${PORTAL_URL}/${locale}`
    }, [locale])

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-white text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p>Redirecting...</p>
            </div>
        </div>
    )
}
