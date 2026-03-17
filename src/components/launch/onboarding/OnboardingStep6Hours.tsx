'use client'

import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'
import type { FormData, UpdateFieldFn } from './types'

const DAYS = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' },
] as const

type Props = {
  formData: FormData
  updateField: UpdateFieldFn
  t: (key: string) => string
}

export default function OnboardingStep6Hours({ formData, updateField, t }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">{t('onboarding.form.businessHours')}</label>
        <div className="grid gap-2">
          {DAYS.map((day) => (
            <div key={day.key} className="flex items-center gap-3">
              <span className="w-24 text-sm text-slate-400">{day.label}</span>
              <input
                type="text"
                value={formData.businessHours[day.key] ?? ''}
                onChange={(e) =>
                  updateField('businessHours', { ...formData.businessHours, [day.key]: e.target.value })
                }
                placeholder="e.g., 9am - 5pm or Closed"
                className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">{t('onboarding.form.socialMedia')}</label>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-slate-400 flex items-center gap-2 mb-1">
              <Facebook className="w-4 h-4" /> Facebook
            </label>
            <input
              type="url"
              value={formData.socialFacebook}
              onChange={(e) => updateField('socialFacebook', e.target.value)}
              placeholder="https://facebook.com/yourpage"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 flex items-center gap-2 mb-1">
              <Instagram className="w-4 h-4" /> Instagram
            </label>
            <input
              type="url"
              value={formData.socialInstagram}
              onChange={(e) => updateField('socialInstagram', e.target.value)}
              placeholder="https://instagram.com/yourhandle"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 flex items-center gap-2 mb-1">
              <Linkedin className="w-4 h-4" /> LinkedIn
            </label>
            <input
              type="url"
              value={formData.socialLinkedin}
              onChange={(e) => updateField('socialLinkedin', e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 flex items-center gap-2 mb-1">
              <Youtube className="w-4 h-4" /> YouTube
            </label>
            <input
              type="url"
              value={formData.socialYoutube}
              onChange={(e) => updateField('socialYoutube', e.target.value)}
              placeholder="https://youtube.com/@yourchannel"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
