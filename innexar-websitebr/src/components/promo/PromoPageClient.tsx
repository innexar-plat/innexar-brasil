'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Rocket, Globe, Smartphone, TrendingUp, BarChart } from 'lucide-react';
import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://innexar.com.br';
export const metadata: Metadata = {
  title: 'Promoção Especial | Innexar',
  description: 'Oferta exclusiva para criação de sites profissionais com desconto especial.',
  openGraph: {
    title: 'Promoção Especial | Innexar',
    description: 'Oferta exclusiva para criação de sites profissionais com desconto especial.',
    url: `${SITE_URL}/promo`,
    images: [{ url: `${SITE_URL}/og-image.jpg` }],
  },
};

export default function PromoPageClient() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-950 to-slate-900">
      <div className="container mx-auto px-4 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <BarChart className="h-4 w-4" />
            Oferta por tempo limitado
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
              50% OFF
            </span>
            <br />
            na Criação do Seu Site
          </h1>

          <p className="text-xl text-slate-300 mb-10">
            Aproveite nossa oferta especial e tenha um site profissional com desconto exclusivo. Por tempo limitado!
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left mb-10">
            {[
              { icon: Globe, title: 'Site Profissional', desc: 'Design moderno e responsivo' },
              { icon: Smartphone, title: 'Mobile First', desc: 'Perfeito em qualquer dispositivo' },
              { icon: TrendingUp, title: 'SEO Incluso', desc: 'Para aparecer no Google' },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-xl p-5 border border-white/10">
                <item.icon className="h-8 w-8 text-orange-400 mb-3" />
                <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>

          <Link
            href="/criar-site"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-10 py-5 rounded-xl font-bold text-lg hover:from-orange-400 hover:to-yellow-400 transition-all duration-300 shadow-xl shadow-orange-500/30 hover:scale-105"
          >
            <Rocket className="h-6 w-6" />
            Quero meu site com 50% OFF!
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
