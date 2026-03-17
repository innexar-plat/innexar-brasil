'use client'

import { motion } from 'framer-motion'
import { Plus, X, Globe } from 'lucide-react'
import type { FormData, UpdateFieldFn } from './types'
import { colorPalettes } from './types'

type Props = {
  formData: FormData
  updateField: UpdateFieldFn
  selectColorPalette: (paletteId: string) => void
  referenceInput: string
  setReferenceInput: (v: string) => void
  addReference: () => void
  t: (key: string) => string
}

export default function OnboardingStep5Colors({
  formData,
  updateField,
  selectColorPalette,
  referenceInput,
  setReferenceInput,
  addReference,
  t,
}: Props) {
  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">{t('onboarding.form.colorPalette')}</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {colorPalettes
            .filter((p) => p.id !== 'custom')
            .map((palette) => (
              <motion.button
                key={palette.id}
                type="button"
                whileHover={{ scale: 1.02 }}
                onClick={() => selectColorPalette(palette.id)}
                className={`p-4 rounded-xl border transition-all ${
                  formData.colorPalette === palette.id ? 'border-white ring-2 ring-white/50' : 'border-white/10 hover:border-white/30'
                }`}
              >
                <div className="flex gap-1 mb-2">
                  <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: palette.primary }} />
                  <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: palette.secondary }} />
                  <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: palette.accent }} />
                </div>
                <div className="text-xs">{palette.name}</div>
              </motion.button>
            ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">Or Choose Custom Colors</label>
        <div className="grid grid-cols-3 gap-4">
          {(['primary', 'secondary', 'accent'] as const).map((colorType) => (
            <div key={colorType}>
              <label className="text-xs text-slate-400 capitalize">{colorType}</label>
              <div className="flex gap-2 items-center mt-1">
                <input
                  type="color"
                  value={(formData[`${colorType}Color`] as string) ?? '#000000'}
                  onChange={(e) => {
                    updateField(`${colorType}Color`, e.target.value)
                    updateField('colorPalette', 'custom')
                  }}
                  className="w-12 h-12 rounded-lg cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={(formData[`${colorType}Color`] as string) ?? ''}
                  onChange={(e) => {
                    updateField(`${colorType}Color`, e.target.value)
                    updateField('colorPalette', 'custom')
                  }}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm font-mono"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Reference Sites (Optional)</label>
        <p className="text-xs text-slate-400 mb-2">Add URLs of websites you like for design inspiration</p>
        <div className="flex gap-2">
          <input
            type="url"
            value={referenceInput}
            onChange={(e) => setReferenceInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addReference())}
            placeholder="https://example.com"
            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button type="button" onClick={addReference} className="px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
        {formData.referenceSites.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {formData.referenceSites.map((site, i) => (
              <span key={i} className="px-3 py-1 bg-white/10 rounded-lg flex items-center gap-2 text-sm">
                <Globe className="w-3 h-3" />
                {site.length > 25 ? site.substring(0, 25) + '...' : site}
                <button
                  type="button"
                  onClick={() => updateField('referenceSites', formData.referenceSites.filter((_, j) => j !== i))}
                  className="text-slate-400 hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Additional Design Notes (Optional)</label>
        <textarea
          value={formData.designNotes}
          onChange={(e) => updateField('designNotes', e.target.value)}
          placeholder="Any specific design preferences, elements you want, or things to avoid..."
          rows={3}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
  )
}
