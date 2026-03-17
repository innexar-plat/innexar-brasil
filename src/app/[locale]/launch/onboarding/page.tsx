'use client'

import { Suspense } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import {
  Building2,
  MapPin,
  Briefcase,
  Target,
  Palette,
  Clock,
  Star,
  Phone,
  ChevronRight,
  ChevronLeft,
  Rocket,
  FileText,
  Image,
  Users,
  MessageCircle,
  Calendar,
  FileSignature,
  Utensils,
  Scale,
  Stethoscope,
  Home,
  Wrench,
  Zap,
  TreeDeciduous,
  Sparkle,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import Header from '@/components/Header'
import { TOTAL_STEPS } from '@/components/launch/onboarding/types'
import OnboardingCompleteScreen from '@/components/launch/onboarding/OnboardingCompleteScreen'
import OnboardingLoginModal from '@/components/launch/onboarding/OnboardingLoginModal'
import OnboardingProgressHeader from '@/components/launch/onboarding/OnboardingProgressHeader'
import OnboardingStep1Business from '@/components/launch/onboarding/OnboardingStep1Business'
import OnboardingStep2Location from '@/components/launch/onboarding/OnboardingStep2Location'
import OnboardingStep3Services from '@/components/launch/onboarding/OnboardingStep3Services'
import OnboardingStep4Objective from '@/components/launch/onboarding/OnboardingStep4Objective'
import OnboardingStep5Colors from '@/components/launch/onboarding/OnboardingStep5Colors'
import OnboardingStep6Hours from '@/components/launch/onboarding/OnboardingStep6Hours'
import OnboardingStep7Testimonials from '@/components/launch/onboarding/OnboardingStep7Testimonials'
import OnboardingStep8Contract from '@/components/launch/onboarding/OnboardingStep8Contract'
import { useOnboardingState } from '@/components/launch/onboarding/useOnboardingState'

const nicheIcons = {
  restaurant: Utensils,
  lawyer: Scale,
  dentist: Stethoscope,
  real_estate: Home,
  plumber: Wrench,
  electrician: Zap,
  landscaping: TreeDeciduous,
  cleaning: Sparkle,
  general: Briefcase,
  other: Building2,
}
const objectiveIcons = { generate_leads: Phone, show_portfolio: Image, build_trust: Users, inform: FileText }
const ctaIcons = { call: Phone, whatsapp: MessageCircle, form: FileText, book_online: Calendar }

function OnboardingContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('order_id')
  const t = useTranslations('launch')
  const state = useOnboardingState(orderId)

  const steps = [
    { id: 1, title: t('onboarding.steps.step1'), icon: Building2, description: t('onboarding.steps.step1Desc') },
    { id: 2, title: t('onboarding.steps.step2'), icon: MapPin, description: t('onboarding.steps.step2Desc') },
    { id: 3, title: t('onboarding.steps.step3'), icon: Briefcase, description: t('onboarding.steps.step3Desc') },
    { id: 4, title: t('onboarding.steps.step4'), icon: Target, description: t('onboarding.steps.step4Desc') },
    { id: 5, title: t('onboarding.steps.step5'), icon: Palette, description: t('onboarding.steps.step5Desc') },
    { id: 6, title: t('onboarding.steps.step6'), icon: Clock, description: t('onboarding.steps.step6Desc') },
    { id: 7, title: t('onboarding.steps.step7'), icon: Star, description: t('onboarding.steps.step7Desc') },
    { id: 8, title: t('onboarding.steps.step8'), icon: FileSignature, description: t('onboarding.steps.step8Desc') },
  ]
  const objectives = [
    { id: 'generate_leads', label: t('onboarding.form.objectives.leads'), desc: t('onboarding.form.objectives.leadsDesc'), icon: objectiveIcons.generate_leads },
    { id: 'show_portfolio', label: t('onboarding.form.objectives.info'), desc: t('onboarding.form.objectives.infoDesc'), icon: objectiveIcons.show_portfolio },
    { id: 'build_trust', label: t('onboarding.form.objectives.credibility'), desc: t('onboarding.form.objectives.credibilityDesc'), icon: objectiveIcons.build_trust },
    { id: 'inform', label: t('onboarding.form.objectives.bookings'), desc: t('onboarding.form.objectives.bookingsDesc'), icon: objectiveIcons.inform },
  ]
  const niches = [
    { id: 'restaurant', label: t('onboarding.form.niches.restaurant'), icon: nicheIcons.restaurant },
    { id: 'lawyer', label: t('onboarding.form.niches.lawyer'), icon: nicheIcons.lawyer },
    { id: 'dentist', label: t('onboarding.form.niches.dentist'), icon: nicheIcons.dentist },
    { id: 'real_estate', label: t('onboarding.form.niches.realEstate'), icon: nicheIcons.real_estate },
    { id: 'plumber', label: t('onboarding.form.niches.plumber'), icon: nicheIcons.plumber },
    { id: 'electrician', label: t('onboarding.form.niches.electrician'), icon: nicheIcons.electrician },
    { id: 'landscaping', label: t('onboarding.form.niches.landscaping'), icon: nicheIcons.landscaping },
    { id: 'cleaning', label: t('onboarding.form.niches.cleaning'), icon: nicheIcons.cleaning },
    { id: 'general', label: t('onboarding.form.niches.general'), icon: nicheIcons.general },
    { id: 'other', label: t('onboarding.form.niches.other'), icon: nicheIcons.other },
  ]
  const pages = [
    { id: 'home', label: t('onboarding.form.pages.home'), required: true },
    { id: 'about', label: t('onboarding.form.pages.about') },
    { id: 'services', label: t('onboarding.form.pages.services') },
    { id: 'contact', label: t('onboarding.form.pages.contact'), required: true },
    { id: 'gallery', label: t('onboarding.form.pages.gallery') },
    { id: 'testimonials', label: t('onboarding.form.pages.testimonials') },
    { id: 'faq', label: t('onboarding.form.pages.faq') },
    { id: 'pricing', label: t('onboarding.form.pages.pricing') },
    { id: 'team', label: t('onboarding.form.pages.team') },
    { id: 'blog', label: t('onboarding.form.pages.blog') },
  ]
  const tones = [
    { id: 'professional', label: t('onboarding.form.tones.professional'), desc: t('onboarding.form.tones.professionalDesc') },
    { id: 'friendly', label: t('onboarding.form.tones.friendly'), desc: t('onboarding.form.tones.friendlyDesc') },
    { id: 'premium', label: t('onboarding.form.tones.premium'), desc: t('onboarding.form.tones.premiumDesc') },
  ]
  const ctaOptions = [
    { id: 'call', label: t('onboarding.form.cta.call'), icon: ctaIcons.call },
    { id: 'whatsapp', label: t('onboarding.form.cta.whatsapp'), icon: ctaIcons.whatsapp },
    { id: 'form', label: t('onboarding.form.cta.form'), icon: ctaIcons.form },
    { id: 'book_online', label: t('onboarding.form.cta.bookOnline'), icon: ctaIcons.book_online },
  ]

  const tk = (k: string, values?: Record<string, string | number>) => (values ? t(k, values) : t(k))
  const wrapToggle = (pageId: string) => state.togglePage(pageId, pages)

  if (state.isComplete) {
    return <OnboardingCompleteScreen orderId={orderId} businessEmail={state.formData.businessEmail ?? ''} t={tk} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      <Header />
      <div className="py-8 px-4 md:px-6 pt-40">
        <div className="max-w-4xl mx-auto">
          <OnboardingProgressHeader steps={steps} currentStep={state.currentStep} setCurrentStep={state.setCurrentStep} t={tk} />
          <OnboardingLoginModal show={state.showLoginModal} onClose={() => state.setShowLoginModal(false)} t={tk} />
          <motion.div
            key={state.currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8"
          >
            {state.currentStep === 1 && (
              <OnboardingStep1Business
                formData={state.formData}
                updateField={state.updateField}
                checkEmail={state.checkEmail}
                isCheckingEmail={state.isCheckingEmail}
                emailExists={state.emailExists}
                t={tk}
              />
            )}
            {state.currentStep === 2 && (
              <OnboardingStep2Location
                formData={state.formData}
                updateField={state.updateField}
                serviceAreaInput={state.serviceAreaInput}
                setServiceAreaInput={state.setServiceAreaInput}
                addServiceArea={state.addServiceArea}
                niches={niches}
                t={tk}
              />
            )}
            {state.currentStep === 3 && (
              <OnboardingStep3Services
                formData={state.formData}
                updateField={state.updateField}
                serviceInput={state.serviceInput}
                setServiceInput={state.setServiceInput}
                addService={state.addService}
                removeService={state.removeService}
                t={tk}
              />
            )}
            {state.currentStep === 4 && (
              <OnboardingStep4Objective
                formData={state.formData}
                updateField={state.updateField}
                objectives={objectives}
                pages={pages}
                tones={tones}
                ctaOptions={ctaOptions}
                togglePage={wrapToggle}
                allowedPages={state.allowedPages}
                t={tk}
              />
            )}
            {state.currentStep === 5 && (
              <OnboardingStep5Colors
                formData={state.formData}
                updateField={state.updateField}
                selectColorPalette={state.selectColorPalette}
                referenceInput={state.referenceInput}
                setReferenceInput={state.setReferenceInput}
                addReference={state.addReference}
                t={tk}
              />
            )}
            {state.currentStep === 6 && <OnboardingStep6Hours formData={state.formData} updateField={state.updateField} t={tk} />}
            {state.currentStep === 7 && (
              <OnboardingStep7Testimonials
                formData={state.formData}
                updateField={state.updateField}
                newTestimonial={state.newTestimonial}
                setNewTestimonial={state.setNewTestimonial}
                addTestimonial={state.addTestimonial}
                t={tk}
              />
            )}
            {state.currentStep === 8 && (
              <OnboardingStep8Contract
                getContractText={state.getContractText}
                isSigned={state.isSigned}
                signatureName={state.signatureName}
                setSignatureName={state.setSignatureName}
                onSign={state.handleSignContract}
                isSubmitting={state.isSubmitting}
                t={tk}
              />
            )}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
              <motion.button
                type="button"
                whileHover={{ scale: state.currentStep > 1 ? 1.02 : 1 }}
                whileTap={{ scale: state.currentStep > 1 ? 0.98 : 1 }}
                onClick={() => state.setCurrentStep((prev) => Math.max(1, prev - 1))}
                disabled={state.currentStep === 1}
                className={`px-6 py-3 rounded-xl font-medium flex items-center gap-2 ${state.currentStep === 1 ? 'opacity-50 cursor-not-allowed' : 'bg-white/10 hover:bg-white/20'}`}
              >
                <ChevronLeft className="w-5 h-5" />
                {t('onboarding.navigation.previous')}
              </motion.button>
              {state.currentStep < TOTAL_STEPS ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: state.canProceed() ? 1.02 : 1 }}
                  whileTap={{ scale: state.canProceed() ? 0.98 : 1 }}
                  onClick={() => state.canProceed() && state.setCurrentStep((prev) => prev + 1)}
                  className={`px-8 py-3 rounded-xl font-medium flex items-center gap-2 ${state.canProceed() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-slate-700 cursor-not-allowed'}`}
                >
                  {t('onboarding.navigation.next')} <ChevronRight className="w-5 h-5" />
                </motion.button>
              ) : (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={state.handleSubmit}
                  disabled={state.isSubmitting}
                  className={`px-8 py-3 rounded-xl font-medium flex items-center gap-2 ${state.isSubmitting ? 'bg-slate-700 cursor-wait' : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'}`}
                >
                  {state.isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t('onboarding.navigation.submitting')}
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                      {t('onboarding.navigation.submit')}
                    </>
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
          <div className="mt-6 text-center text-slate-400 text-sm">
            Progress: {Math.round((state.currentStep / TOTAL_STEPS) * 100)}% complete
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OnboardingContent />
    </Suspense>
  )
}
