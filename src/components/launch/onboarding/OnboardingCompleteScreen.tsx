'use client'

import { motion } from 'framer-motion'
import { Link } from '@/i18n/navigation'
import { PartyPopper, Rocket, Check, LayoutDashboard, Sparkles } from 'lucide-react'
type Props = {
  orderId: string | null
  businessEmail: string
  t: (key: string) => string
}

export default function OnboardingCompleteScreen({ orderId, businessEmail, t }: Props) {
  const dashboardHref = `/launch/dashboard?order_id=${orderId ?? ''}&email=${encodeURIComponent(businessEmail)}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-6">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 relative z-10"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30"
        >
          <motion.div initial={{ rotate: -180, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
            <PartyPopper className="w-12 h-12 text-white" />
          </motion.div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-white mb-2"
        >
          {t('onboarding.complete.title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-green-400 font-medium mb-4"
        >
          {t('onboarding.complete.subtitle')}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-slate-300 mb-4"
        >
          {t('onboarding.complete.message')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="bg-green-500/20 border border-green-400/30 rounded-xl p-4 mb-8"
        >
          <div className="flex items-center gap-3 text-green-300">
            <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
            <span className="font-medium">{t('onboarding.complete.loadingMessage')}</span>
          </div>
          <p className="text-sm text-green-200/70 mt-2">{t('onboarding.complete.loadingDescription')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-5 text-left mb-6"
        >
          <p className="font-semibold text-blue-300 mb-3 flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            {t('onboarding.complete.nextSteps')}
          </p>
          <div className="space-y-2 text-sm">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span>{t(`onboarding.complete.step${i}`)}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-sm text-slate-400 mb-2"
          >
            Redirecionando para o dashboard em 5 segundos...
          </motion.div>
          <a
            href={dashboardHref}
            className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl font-bold text-white shadow-lg shadow-blue-500/25 transition-all"
          >
            <LayoutDashboard className="w-5 h-5" />
            {t('onboarding.complete.dashboardButton')}
          </a>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl font-medium text-slate-300 transition-all"
          >
            {t('onboarding.form.backHome')}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 pt-6 border-t border-white/10"
        >
          <div className="flex items-center justify-center gap-2 text-slate-500 text-xs">
            <Sparkles className="w-4 h-4" />
            Trusted by 200+ local businesses
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
