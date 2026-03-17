'use client'

import { motion } from 'framer-motion'
import { Plus, X, Star } from 'lucide-react'
import type { FormData, UpdateFieldFn } from './types'

type Props = {
  formData: FormData
  updateField: UpdateFieldFn
  serviceInput: string
  setServiceInput: (v: string) => void
  addService: () => void
  removeService: (index: number) => void
  t: (key: string) => string
}

export default function OnboardingStep3Services({
  formData,
  updateField,
  serviceInput,
  setServiceInput,
  addService,
  removeService,
  t,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">{t('onboarding.form.services')} *</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={serviceInput}
            onChange={(e) => setServiceInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
            placeholder="e.g., Emergency Repairs"
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="button"
            onClick={addService}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add
          </button>
        </div>
      </div>
      {formData.services.length > 0 && (
        <div>
          <p className="text-sm text-slate-400 mb-2">Click to select your PRIMARY service:</p>
          <div className="flex flex-wrap gap-2">
            {formData.services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors ${
                  formData.primaryService === service ? 'bg-blue-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
                onClick={() => updateField('primaryService', service)}
              >
                {formData.primaryService === service && <Star className="w-4 h-4" />}
                <span>{service}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeService(index)
                  }}
                  className="ml-1 text-slate-400 hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
