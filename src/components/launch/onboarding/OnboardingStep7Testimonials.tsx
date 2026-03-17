'use client'

import { Plus, X } from 'lucide-react'
import type { FormData, Testimonial, UpdateFieldFn } from './types'

type Props = {
  formData: FormData
  updateField: UpdateFieldFn
  newTestimonial: Testimonial
  setNewTestimonial: (t: Testimonial) => void
  addTestimonial: () => void
  t: (key: string) => string
}

export default function OnboardingStep7Testimonials({
  formData,
  updateField,
  newTestimonial,
  setNewTestimonial,
  addTestimonial,
  t,
}: Props) {
  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">{t('onboarding.form.testimonials')}</label>
        <p className="text-xs text-slate-400 mb-3">Add reviews from happy customers to display on your site</p>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
          <input
            type="text"
            value={newTestimonial.name}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
            placeholder="Customer name"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
          />
          <input
            type="text"
            value={newTestimonial.role ?? ''}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, role: e.target.value })}
            placeholder="Role (e.g., Homeowner, Business Owner)"
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
          />
          <textarea
            value={newTestimonial.text}
            onChange={(e) => setNewTestimonial({ ...newTestimonial, text: e.target.value })}
            placeholder="Their review or testimonial..."
            rows={2}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 text-sm"
          />
          <button
            type="button"
            onClick={addTestimonial}
            className="w-full py-2 bg-blue-500/20 border border-blue-400/30 rounded-lg text-blue-300 hover:bg-blue-500/30 flex items-center justify-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Testimonial
          </button>
        </div>

        {formData.testimonials.length > 0 && (
          <div className="mt-4 space-y-3">
            {formData.testimonials.map((testimonial, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 relative">
                <button
                  type="button"
                  onClick={() => updateField('testimonials', formData.testimonials.filter((_, j) => j !== i))}
                  className="absolute top-2 right-2 text-slate-400 hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="font-medium">{testimonial.name}</div>
                {testimonial.role && <div className="text-xs text-slate-400">{testimonial.role}</div>}
                <div className="text-sm text-slate-300 mt-2">&quot;{testimonial.text}&quot;</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">{t('onboarding.form.googleReviews')}</label>
        <input
          type="url"
          value={formData.googleReviewsLink}
          onChange={(e) => updateField('googleReviewsLink', e.target.value)}
          placeholder="https://g.page/yourbusiness/review"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">{t('onboarding.form.aboutOwner')}</label>
        <textarea
          value={formData.aboutOwner}
          onChange={(e) => updateField('aboutOwner', e.target.value)}
          placeholder="Share your story, experience, and what makes your business special..."
          rows={4}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">{t('onboarding.form.yearsInBusiness')}</label>
        <input
          type="number"
          value={formData.yearsInBusiness}
          onChange={(e) => updateField('yearsInBusiness', e.target.value)}
          placeholder="e.g., 10"
          className="w-32 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
  )
}
