'use client'

import { Check, FileSignature } from 'lucide-react'
type Props = {
  getContractText: () => string
  isSigned: boolean
  signatureName: string
  setSignatureName: (v: string) => void
  onSign: () => void
  isSubmitting: boolean
  t: (key: string, values?: Record<string, string | number>) => string
}

export default function OnboardingStep8Contract({
  getContractText,
  isSigned,
  signatureName,
  setSignatureName,
  onSign,
  isSubmitting,
  t,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-white/5 border border-white/10 rounded-xl p-6 max-h-[400px] overflow-y-auto text-sm text-slate-300 prose prose-invert prose-blue max-w-none">
        <div className="whitespace-pre-line">{getContractText()}</div>
      </div>

      {!isSigned ? (
        <div className="space-y-4 pt-4 border-t border-white/10">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t('onboarding.form.contract.signatureLabel')}
            </label>
            <input
              type="text"
              value={signatureName}
              onChange={(e) => setSignatureName(e.target.value)}
              placeholder={t('onboarding.form.contract.signaturePlaceholder')}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={onSign}
            disabled={isSubmitting || !signatureName.trim()}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FileSignature className="w-5 h-5" />
            )}
            {t('onboarding.form.contract.signButton')}
          </button>
          <p className="text-[10px] text-slate-500 text-center uppercase tracking-wider">
            {t('onboarding.form.contract.signingDisclaimer')}
          </p>
        </div>
      ) : (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-1">{t('onboarding.form.contract.signedTitle')}</h3>
          <p className="text-sm text-green-400">
            {t('onboarding.form.contract.signedAs', {
              name: signatureName,
              date: new Date().toLocaleDateString(),
            })}
          </p>
          <p className="text-sm text-slate-400 mt-4">{t('onboarding.form.contract.proceedMessage')}</p>
        </div>
      )}
    </div>
  )
}
