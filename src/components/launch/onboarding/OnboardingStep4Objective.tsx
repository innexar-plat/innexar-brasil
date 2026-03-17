'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import type { FormData, UpdateFieldFn } from './types'
import type { LucideIcon } from 'lucide-react'

type ObjectiveOption = { id: string; label: string; desc: string; icon: LucideIcon }
type PageOption = { id: string; label: string; required?: boolean }
type ToneOption = { id: string; label: string; desc: string }
type CtaOption = { id: string; label: string; icon: LucideIcon }

type Props = {
  formData: FormData
  updateField: UpdateFieldFn
  objectives: ObjectiveOption[]
  pages: PageOption[]
  tones: ToneOption[]
  ctaOptions: CtaOption[]
  togglePage: (pageId: string) => void
  allowedPages: number
  t: (key: string) => string
}

export default function OnboardingStep4Objective({
  formData,
  updateField,
  objectives,
  pages,
  tones,
  ctaOptions,
  togglePage,
  t,
}: Props) {
  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">{t('onboarding.form.siteObjective')} *</label>
        <div className="grid md:grid-cols-2 gap-3">
          {objectives.map((obj) => {
            const ObjIcon = obj.icon
            return (
              <motion.button
                key={obj.id}
                type="button"
                whileHover={{ scale: 1.02 }}
                onClick={() => updateField('siteObjective', obj.id)}
                className={`p-4 rounded-xl border text-left transition-colors ${
                  formData.siteObjective === obj.id ? 'bg-blue-500/20 border-blue-400' : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ObjIcon className="w-6 h-6" />
                  <div>
                    <div className="font-medium">{obj.label}</div>
                    <div className="text-xs text-slate-400">{obj.desc}</div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">{t('onboarding.form.selectPages')}</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {pages.map((page) => (
            <motion.button
              key={page.id}
              type="button"
              whileHover={{ scale: page.required ? 1 : 1.02 }}
              onClick={() => togglePage(page.id)}
              className={`p-3 rounded-xl border text-sm transition-colors flex items-center justify-center gap-1 ${
                formData.selectedPages.includes(page.id) ? 'bg-blue-500/20 border-blue-400' : 'bg-white/5 border-white/10 hover:border-white/20'
              } ${page.required ? 'opacity-70 cursor-default' : ''}`}
            >
              {page.label}
              {page.required && <Check className="w-3 h-3 text-blue-300" />}
            </motion.button>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">Selected: {formData.selectedPages.length} pages</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">{t('onboarding.form.siteDescription')}</label>
        <textarea
          value={formData.siteDescription}
          onChange={(e) => updateField('siteDescription', e.target.value)}
          placeholder="Tell us about your business, what makes you different..."
          rows={4}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Website Tone</label>
          <div className="space-y-2">
            {tones.map((tone) => (
              <button
                key={tone.id}
                type="button"
                onClick={() => updateField('tone', tone.id)}
                className={`w-full p-3 rounded-xl border text-left transition-colors ${
                  formData.tone === tone.id ? 'bg-blue-500/20 border-blue-400' : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="font-medium">{tone.label}</div>
                <div className="text-xs text-slate-400">{tone.desc}</div>
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">Main Call to Action</label>
          <div className="grid grid-cols-2 gap-2">
            {ctaOptions.map((cta) => {
              const CtaIcon = cta.icon
              return (
                <button
                  key={cta.id}
                  type="button"
                  onClick={() => updateField('primaryCta', cta.id)}
                  className={`p-3 rounded-xl border text-center transition-colors ${
                    formData.primaryCta === cta.id ? 'bg-blue-500/20 border-blue-400' : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <CtaIcon className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-sm">{cta.label}</div>
                </button>
              )
            })}
          </div>
          <input
            type="text"
            value={formData.ctaText}
            onChange={(e) => updateField('ctaText', e.target.value)}
            placeholder="Custom CTA text (e.g., Get Free Quote)"
            className="w-full mt-3 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  )
}
