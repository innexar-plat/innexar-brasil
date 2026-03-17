'use client'

import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import { Rocket, Clock, Check, ArrowRight, Sparkles } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export default function LaunchBanner() {
  const t = useTranslations('launchBanner')

  const features = [
    { icon: Clock, text: t('feature1') },
    { icon: Check, text: t('feature2') },
    { icon: Sparkles, text: t('feature3') },
  ]

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500" />

      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Content */}
          <motion.div
            className="text-center lg:text-left max-w-2xl"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4">
              <Rocket className="w-4 h-4" />
              {t('badge')}
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {t('title')} <span className="text-yellow-300">{t('highlight')}</span>
            </h2>
            <p className="text-lg text-white/90 mb-6">
              {t('subtitle')}
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-white/90">
                  <feature.icon className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right - Price Card (nova oferta: a partir de R$ 197/mês) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-2xl p-8 text-center min-w-[280px]"
          >
            <div className="text-gray-500 text-sm mb-1">
              {t('fromLabel')}
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-1">
              {t('priceNew')}
            </div>
            <div className="text-gray-600 text-sm mb-4">
              {t('period')}
            </div>
            <div className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm font-semibold mb-4">
              {t('delivery')}
            </div>
            <Link
              href="/criar-site"
              className="group flex items-center justify-center gap-2 w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('ctaNew')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-xs text-gray-500 mt-3">
              {t('guarantee')}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
