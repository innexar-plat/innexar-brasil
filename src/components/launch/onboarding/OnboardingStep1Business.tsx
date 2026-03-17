'use client'

import { Globe, Users, ArrowRight } from 'lucide-react'
import type { FormData, UpdateFieldFn } from './types'

type Props = {
  formData: FormData
  updateField: UpdateFieldFn
  checkEmail: () => void
  isCheckingEmail: boolean
  emailExists: boolean
  t: (key: string) => string
}

export default function OnboardingStep1Business({
  formData,
  updateField,
  checkEmail,
  isCheckingEmail,
  emailExists,
  t,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">{t('onboarding.form.businessName')} *</label>
        <input
          type="text"
          value={formData.businessName}
          onChange={(e) => updateField('businessName', e.target.value)}
          placeholder={t('onboarding.form.businessNamePlaceholder')}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">{t('onboarding.form.email')} *</label>
          <input
            type="email"
            value={formData.businessEmail}
            onChange={(e) => updateField('businessEmail', e.target.value)}
            onBlur={checkEmail}
            placeholder={t('onboarding.form.emailPlaceholder')}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          {isCheckingEmail && (
            <p className="text-xs text-blue-400 mt-1 flex items-center gap-1">
              <span className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              {t('onboarding.form.emailCheck.checking')}
            </p>
          )}
          {emailExists && (
            <p className="text-xs text-red-400 mt-1 flex items-center gap-1">{t('onboarding.form.emailCheck.exists')}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">{t('onboarding.form.phone')} *</label>
          <input
            type="tel"
            value={formData.businessPhone}
            onChange={(e) => updateField('businessPhone', e.target.value)}
            placeholder={t('onboarding.form.phonePlaceholder')}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={formData.hasWhatsapp}
          onChange={(e) => updateField('hasWhatsapp', e.target.checked)}
          className="w-5 h-5 rounded border-white/20 bg-white/10"
        />
        <span className="text-slate-300">{t('onboarding.form.hasWhatsApp')}</span>
      </label>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">{t('onboarding.form.address')}</label>
        <input
          type="text"
          value={formData.businessAddress}
          onChange={(e) => updateField('businessAddress', e.target.value)}
          placeholder={t('onboarding.form.addressPlaceholder')}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
          <Globe className="w-4 h-4 text-slate-400" />
          {t('onboarding.form.domainQuestion')}
        </label>
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="hasDomain"
              checked={formData.hasExistingDomain}
              onChange={() => {
                updateField('hasExistingDomain', true)
                updateField('domainToPurchase', '')
              }}
              className="w-4 h-4 text-blue-500"
            />
            <span className="text-slate-300">{t('onboarding.form.hasDomain')}</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="hasDomain"
              checked={!formData.hasExistingDomain}
              onChange={() => {
                updateField('hasExistingDomain', false)
                updateField('existingDomain', '')
              }}
              className="w-4 h-4 text-blue-500"
            />
            <span className="text-slate-300">{t('onboarding.form.noDomain')}</span>
          </label>
        </div>

        {formData.hasExistingDomain && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">{t('onboarding.form.existingDomain')}</label>
            <input
              type="text"
              value={formData.existingDomain}
              onChange={(e) => updateField('existingDomain', e.target.value)}
              placeholder={t('onboarding.form.existingDomainPlaceholder')}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
            <p className="text-xs text-slate-500 mt-1">{t('onboarding.form.existingDomainHelp')}</p>
          </div>
        )}

        {!formData.hasExistingDomain && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg shrink-0">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-blue-200 mb-1">{t('onboarding.form.noDomain')}</h4>
                <p className="text-sm text-blue-200/70 mb-3 leading-relaxed">{t('onboarding.form.noDomainHelp')}</p>
                <a
                  href="https://registro.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  {t('onboarding.form.noDomainRegistroBr')}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          {t('onboarding.form.password')}
        </h3>
        <p className="text-sm text-slate-400 mb-6">{t('onboarding.form.passwordHelp')}</p>
        <form id="password-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            autoComplete="username"
            value={formData.businessEmail ?? ''}
            readOnly
            tabIndex={-1}
            aria-hidden
            className="sr-only"
          />
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">{t('onboarding.form.password')} *</label>
              <input
                type="password"
                autoComplete="new-password"
                value={formData.password ?? ''}
                onChange={(e) => updateField('password', e.target.value)}
                placeholder={t('onboarding.form.passwordPlaceholder')}
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-slate-500 focus:outline-none ${
                  formData.password && formData.password.length < 8 ? 'border-red-500/50' : 'border-white/20 focus:border-blue-500'
                }`}
              />
              {formData.password && formData.password.length < 8 && (
                <p className="text-xs text-red-400 mt-1">{t('onboarding.form.errors.minPassword')}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">{t('onboarding.form.confirmPassword')} *</label>
              <input
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword ?? ''}
                onChange={(e) => updateField('confirmPassword', e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-slate-500 focus:outline-none ${
                  formData.confirmPassword && formData.password !== formData.confirmPassword
                    ? 'border-red-500/50'
                    : 'border-white/20 focus:border-blue-500'
                }`}
              />
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-400 mt-1">{t('onboarding.form.errors.mismatch')}</p>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
