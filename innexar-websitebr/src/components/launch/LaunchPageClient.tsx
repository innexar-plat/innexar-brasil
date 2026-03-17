'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Rocket, CheckCircle2, ArrowRight } from 'lucide-react';

const features = [
  'Site profissional em até 7 dias',
  'Design moderno e responsivo',
  'SEO otimizado para o Google',
  'Formulário de contato funcional',
  'Integração com WhatsApp',
  '1 ano de hospedagem grátis',
];

export default function LaunchPageClient() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Rocket className="h-4 w-4" />
              Lançamento especial
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
              Seu Site no Ar em{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                7 Dias
              </span>
            </h1>

            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Temos tudo que seu negócio precisa para crescer online. Site profissional, rápido e que converte.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-8"
          >
            <h2 className="text-xl font-semibold text-white mb-6">O que está incluído:</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-slate-300">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center"
          >
            <Link
              href="/criar-site"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-10 py-5 rounded-xl font-bold text-lg hover:from-emerald-400 hover:to-cyan-400 transition-all duration-300 shadow-xl shadow-emerald-500/30 hover:scale-105"
            >
              Começar agora
              <ArrowRight className="h-5 w-5" />
            </Link>
            <p className="text-slate-400 text-sm mt-4">
              Sem contrato de longo prazo. Cancele quando quiser.
            </p>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
