'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Users, Award, Globe2, Heart } from 'lucide-react';

const stats = [
  { icon: Users, value: '120+', label: 'Clientes Ativos' },
  { icon: Globe2, value: '8+', label: 'Anos de Mercado' },
  { icon: Award, value: '98%', label: 'Satisfação' },
  { icon: Heart, value: '24/7', label: 'Suporte' },
];

export default function AboutHero() {
  const t = useTranslations('about');

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-900">
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              {t('badge') || 'Sobre Nós'}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {t('hero.title') || 'Transformando negócios com tecnologia'}
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              {t('hero.description') || 'A Innexar é uma empresa de tecnologia especializada em desenvolvimento de software, aplicativos e infraestrutura digital para empresas que querem crescer no mundo online.'}
            </p>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-4"
                >
                  <stat.icon className="h-6 w-6 text-blue-400 mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 z-10 rounded-2xl" />
              <Image
                src="/logo-innexar.svg"
                alt="Innexar - Tecnologia e Inovação"
                fill
                className="object-contain p-16 z-0"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
