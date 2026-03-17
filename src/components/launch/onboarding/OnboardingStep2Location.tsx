'use client'

import { motion } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import type { FormData, UpdateFieldFn } from './types'
import { brStates, brStateNames } from './types'
import type { LucideIcon } from 'lucide-react'

type NicheOption = { id: string; label: string; icon: LucideIcon }

type Props = {
  formData: FormData
  updateField: UpdateFieldFn
  serviceAreaInput: string
  setServiceAreaInput: (v: string) => void
  addServiceArea: () => void
  niches: NicheOption[]
  t: (key: string) => string
}

export default function OnboardingStep2Location({
  formData,
  updateField,
  serviceAreaInput,
  setServiceAreaInput,
  addServiceArea,
  niches,
  t,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">{t('onboarding.form.niche')} *</label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {niches.map((niche) => {
            const NicheIcon = niche.icon
            return (
              <motion.button
                key={niche.id}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => updateField('niche', niche.id)}
                className={`p-3 rounded-xl border text-center transition-colors ${
                  formData.niche === niche.id ? 'bg-blue-500/20 border-blue-400' : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <NicheIcon className="w-6 h-6 mx-auto mb-1" />
                <div className="text-xs">{niche.label}</div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {formData.niche === 'other' && (
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">{t('onboarding.form.customNiche')} *</label>
          <input
            type="text"
            value={formData.customNiche}
            onChange={(e) => updateField('customNiche', e.target.value)}
            placeholder={t('onboarding.form.customNichePlaceholder')}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">{t('onboarding.form.city')} *</label>
          <input
            type="text"
            value={formData.primaryCity}
            onChange={(e) => updateField('primaryCity', e.target.value)}
            placeholder="e.g., Orlando"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">{t('onboarding.form.state')} *</label>
          <select
            value={formData.state}
            onChange={(e) => updateField('state', e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-blue-500"
          >
            <option value="" className="bg-slate-800">
              Selecione o estado
            </option>
            {brStates.map((state) => (
              <option key={state} value={state} className="bg-slate-800">
                {state} - {brStateNames[state]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">{t('onboarding.form.serviceAreas')}</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={serviceAreaInput}
            onChange={(e) => setServiceAreaInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addServiceArea())}
            placeholder="Add nearby cities..."
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button type="button" onClick={addServiceArea} className="px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        {formData.serviceAreas.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.serviceAreas.map((area, i) => (
              <span key={i} className="px-3 py-1 bg-white/10 rounded-lg flex items-center gap-2">
                {area}
                <button
                  type="button"
                  onClick={() => updateField('serviceAreas', formData.serviceAreas.filter((_, j) => j !== i))}
                  className="text-slate-400 hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
