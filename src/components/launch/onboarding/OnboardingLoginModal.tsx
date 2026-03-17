'use client'

import { motion } from 'framer-motion'
import { AlertCircle, LogIn } from 'lucide-react'
import { Link } from '@/i18n/navigation'

type Props = {
  show: boolean
  onClose: () => void
  t: (key: string) => string
}

export default function OnboardingLoginModal({ show, onClose, t }: Props) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
      >
        <div className="flex items-center gap-3 text-amber-400 mb-4">
          <AlertCircle className="w-8 h-8" />
          <h3 className="text-xl font-bold text-white">{t('onboarding.form.loginModal.title')}</h3>
        </div>
        <p className="text-slate-300 mb-6">{t('onboarding.form.loginModal.message')}</p>
        <div className="flex gap-3">
          <Link
            href="/launch/login"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            {t('onboarding.form.loginModal.loginButton')}
          </Link>
          <button
            onClick={onClose}
            type="button"
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-semibold transition-colors"
          >
            {t('onboarding.form.loginModal.cancelButton')}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
