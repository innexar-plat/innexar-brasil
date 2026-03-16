'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import { Smartphone, Rocket, ArrowLeft } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import Header from '@/components/Header'

export default function AppOnboardingPage() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get('order_id')

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Header />

            <main className="max-w-4xl mx-auto px-6 py-20">
                <Link
                    href="/launch/dashboard"
                    className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar ao Dashboard
                </Link>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 text-center">
                    <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Smartphone className="w-10 h-10 text-blue-400" />
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Onboarding de Aplicativo
                    </h1>

                    <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                        Estamos preparando um fluxo personalizado para o seu aplicativo (Pedido #{orderId}).
                        Em breve, você poderá preencher os detalhes técnicos e funcionalidades aqui.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                        {[
                            { title: 'Funcionalidades', desc: 'Defina o que seu app fará' },
                            { title: 'Design', desc: 'Escolha cores e estilo visual' },
                            { title: 'Plataformas', desc: 'iOS, Android ou Web PWA' }
                        ].map((item, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-2xl">
                                <h3 className="font-bold mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl inline-flex items-center gap-3 text-blue-400">
                        <Rocket className="w-5 h-5" />
                        <span>Nossa equipe entrará em contato para alinhar os detalhes iniciais.</span>
                    </div>
                </div>
            </main>
        </div>
    )
}
