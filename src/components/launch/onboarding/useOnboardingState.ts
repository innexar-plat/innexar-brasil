import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useLocale } from 'next-intl'
import { useTranslations } from 'next-intl'
import confetti from 'canvas-confetti'
import { CONTRACT_TEMPLATES } from '@/lib/contracts'
import { MetaPixel } from '@/lib/meta-pixel'
import {
  TOTAL_STEPS,
  type FormData,
  type Testimonial,
  colorPalettes,
} from './types'

const defaultHours = {
  mon: '9:00 AM - 5:00 PM',
  tue: '9:00 AM - 5:00 PM',
  wed: '9:00 AM - 5:00 PM',
  thu: '9:00 AM - 5:00 PM',
  fri: '9:00 AM - 5:00 PM',
  sat: 'Closed',
  sun: 'Closed',
}

function getInitialFormData(orderId: string | null): FormData {
  return {
    businessName: '',
    businessEmail: '',
    businessPhone: '',
    hasWhatsapp: false,
    businessAddress: '',
    niche: '',
    customNiche: '',
    primaryCity: '',
    state: '',
    serviceAreas: [],
    services: [],
    primaryService: '',
    siteObjective: 'generate_leads',
    siteDescription: '',
    selectedPages: ['home', 'about', 'services', 'contact'],
    tone: 'professional',
    primaryCta: 'call',
    ctaText: '',
    colorPalette: 'blue',
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    accentColor: '#3b82f6',
    referenceSites: [],
    designNotes: '',
    businessHours: { ...defaultHours },
    socialFacebook: '',
    socialInstagram: '',
    socialLinkedin: '',
    socialYoutube: '',
    testimonials: [],
    googleReviewsLink: '',
    aboutOwner: '',
    yearsInBusiness: '',
    desiredDomain: '',
    hasExistingDomain: false,
    existingDomain: '',
    domainToPurchase: '',
    domainPurchased: false,
    password: '',
    confirmPassword: '',
    orderId: orderId ?? '',
    realDbId: undefined,
  }
}

export function useOnboardingState(orderId: string | null) {
  const t = useTranslations('launch')
  const locale = useLocale()
  const router = useRouter()
  const storageKey = orderId ? `onboarding_${orderId}` : 'onboarding_draft'

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [serviceInput, setServiceInput] = useState('')
  const [referenceInput, setReferenceInput] = useState('')
  const [serviceAreaInput, setServiceAreaInput] = useState('')
  const [isSigned, setIsSigned] = useState(false)
  const [signatureName, setSignatureName] = useState('')
  const [allowedPages, setAllowedPages] = useState(5)
  const [formData, setFormData] = useState<FormData>(() => getInitialFormData(orderId))
  const [newTestimonial, setNewTestimonial] = useState<Testimonial>({ name: '', text: '', role: '' })
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [emailExists, setEmailExists] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const hasTrackedLead = useRef(false)
  const hasLoadedFromStorage = useRef(false)

  const updateField = useCallback(<K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === 'businessEmail') setEmailExists(false)
  }, [])

  useEffect(() => {
    if (hasLoadedFromStorage.current) return
    hasLoadedFromStorage.current = true
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const { formData: savedFormData, currentStep: savedStep } = JSON.parse(saved)
        if (savedFormData) setFormData((prev) => ({ ...prev, ...savedFormData }))
        if (savedStep && savedStep > 0 && savedStep <= TOTAL_STEPS) setCurrentStep(savedStep)
      }
    } catch (e) {
      console.error('Error loading saved progress:', e)
    }
  }, [storageKey])

  useEffect(() => {
    if (!hasLoadedFromStorage.current) return
    try {
      localStorage.setItem(storageKey, JSON.stringify({ formData, currentStep, savedAt: new Date().toISOString() }))
    } catch (e) {
      console.error('Error saving progress:', e)
    }
  }, [formData, currentStep, storageKey])

  useEffect(() => {
    if (orderId && orderId !== formData.orderId) updateField('orderId', orderId)
  }, [orderId, formData.orderId, updateField])

  useEffect(() => {
    const finalOrderId = orderId || formData.orderId
    if (!finalOrderId) return
    fetch(`/api/launch/session-order?session_id=${finalOrderId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { realDbId?: number; addons?: { addon?: { slug?: string }; slug?: string }[] } | null) => {
        if (data?.realDbId) updateField('realDbId', data.realDbId)
        if (data?.addons) {
          const extra = data.addons.filter((a) => a.addon?.slug === 'extra-page' || a.slug === 'extra-page').length
          setAllowedPages(5 + extra)
        }
      })
      .catch((e) => console.error('Error fetching order addons:', e))
  }, [orderId, formData.orderId, updateField])

  useEffect(() => {
    const finalOrderId = orderId || formData.orderId
    if (!finalOrderId) return
    fetch(`/api/launch/onboarding?order_id=${finalOrderId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { is_complete?: boolean } | null) => {
        if (data?.is_complete) {
          localStorage.removeItem(storageKey)
          router.push(`/launch/dashboard?order_id=${finalOrderId}&email=${encodeURIComponent(formData.businessEmail || '')}`)
        }
      })
      .catch((e) => console.error('[Onboarding] Error checking status:', e))
  }, [orderId, formData.orderId, formData.businessEmail, storageKey, router])

  useEffect(() => {
    if (!formData.realDbId) return
    fetch(`/api/launch/sign-contract?order_id=${formData.realDbId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { signed?: boolean; signed_name?: string } | null) => {
        if (data?.signed) {
          setIsSigned(true)
          if (data.signed_name) setSignatureName(data.signed_name)
        }
      })
      .catch((e) => console.error('Error checking contract status:', e))
  }, [formData.realDbId])

  useEffect(() => {
    if (!hasTrackedLead.current) {
      hasTrackedLead.current = true
      MetaPixel.lead({ content_name: 'Site Onboarding Started', content_category: 'Website Services' })
    }
  }, [])

  const checkEmail = useCallback(async () => {
    if (!formData.businessEmail?.includes('@')) return
    setIsCheckingEmail(true)
    try {
      const r = await fetch(`/api/launch/check-email?email=${encodeURIComponent(formData.businessEmail)}`)
      const data = await r.json()
      setEmailExists(!!data.exists)
      if (data.exists) setShowLoginModal(true)
    } catch (e) {
      console.error('Error checking email:', e)
    } finally {
      setIsCheckingEmail(false)
    }
  }, [formData.businessEmail])

  const selectColorPalette = useCallback(
    (paletteId: string) => {
      const palette = colorPalettes.find((p) => p.id === paletteId)
      if (palette && palette.id !== 'custom') {
        updateField('colorPalette', paletteId)
        updateField('primaryColor', palette.primary)
        updateField('secondaryColor', palette.secondary)
        updateField('accentColor', palette.accent)
      } else {
        updateField('colorPalette', 'custom')
      }
    },
    [updateField]
  )

  const addService = useCallback(() => {
    if (!serviceInput.trim() || formData.services.length >= 15) return
    const newServices = [...formData.services, serviceInput.trim()]
    updateField('services', newServices)
    if (!formData.primaryService) updateField('primaryService', newServices[0] ?? '')
    setServiceInput('')
  }, [serviceInput, formData.services, formData.primaryService, updateField])

  const removeService = useCallback(
    (index: number) => {
      const newServices = formData.services.filter((_, i) => i !== index)
      updateField('services', newServices)
      if (formData.primaryService === formData.services[index]) updateField('primaryService', newServices[0] ?? '')
    },
    [formData.services, formData.primaryService, updateField]
  )

  const addServiceArea = useCallback(() => {
    if (serviceAreaInput.trim() && formData.serviceAreas.length < 10) {
      updateField('serviceAreas', [...formData.serviceAreas, serviceAreaInput.trim()])
      setServiceAreaInput('')
    }
  }, [serviceAreaInput, formData.serviceAreas, updateField])

  const addReference = useCallback(() => {
    if (referenceInput.trim() && formData.referenceSites.length < 5) {
      updateField('referenceSites', [...formData.referenceSites, referenceInput.trim()])
      setReferenceInput('')
    }
  }, [referenceInput, formData.referenceSites, updateField])

  const addTestimonial = useCallback(() => {
    if (newTestimonial.name && newTestimonial.text && formData.testimonials.length < 10) {
      updateField('testimonials', [...formData.testimonials, { ...newTestimonial }])
      setNewTestimonial({ name: '', text: '', role: '' })
    }
  }, [newTestimonial, formData.testimonials, updateField])

  const togglePage = useCallback(
    (pageId: string, pages: { id: string; required?: boolean }[]) => {
      const page = pages.find((p) => p.id === pageId)
      if (page?.required) return
      if (formData.selectedPages.includes(pageId)) {
        updateField('selectedPages', formData.selectedPages.filter((p) => p !== pageId))
      } else {
        if (formData.selectedPages.length >= allowedPages) {
          alert(`You have reached the limit of ${allowedPages} pages for your package.`)
          return
        }
        updateField('selectedPages', [...formData.selectedPages, pageId])
      }
    },
    [formData.selectedPages, allowedPages, updateField]
  )

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return !!(
          formData.businessName &&
          formData.businessEmail &&
          formData.businessPhone &&
          !emailExists &&
          !isCheckingEmail &&
          formData.password &&
          formData.password.length >= 8 &&
          formData.password === formData.confirmPassword
        )
      case 2:
        return !!(formData.niche && formData.primaryCity && formData.state && (formData.niche !== 'other' || formData.customNiche))
      case 3:
        return formData.services.length > 0 && !!formData.primaryService
      case 4:
        return !!formData.siteObjective && formData.selectedPages.length >= 2
      case 5:
        return !!formData.primaryColor
      case 6:
      case 7:
        return true
      case 8:
        return isSigned
      default:
        return false
    }
  }, [currentStep, formData, emailExists, isCheckingEmail, isSigned])

  const getContractText = useCallback(() => {
    const template = CONTRACT_TEMPLATES[locale as keyof typeof CONTRACT_TEMPLATES] || CONTRACT_TEMPLATES.en
    return template.replace('{{business_name}}', formData.businessName || 'Client')
  }, [locale, formData.businessName])

  const handleSignContract = useCallback(async () => {
    const dbId = formData.realDbId
    const finalOrderId = formData.orderId || orderId
    const idToSend = dbId ?? (finalOrderId && !isNaN(parseInt(finalOrderId, 10)) ? parseInt(finalOrderId, 10) : 0)
    if (!idToSend) {
      alert(t('onboarding.form.contract.orderIdError'))
      return
    }
    if (!signatureName.trim()) {
      alert(t('onboarding.form.contract.nameRequired'))
      return
    }
    setIsSubmitting(true)
    try {
      const r = await fetch('/api/launch/sign-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: idToSend, content: getContractText(), signed_name: signatureName, language: locale }),
      })
      const data = await r.json()
      if (r.ok) {
        setIsSigned(true)
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } })
      } else throw new Error((data as { error?: string; detail?: string }).error || (data as { error?: string; detail?: string }).detail || 'Failed to sign contract')
    } catch (err) {
      console.error('Error signing contract:', err)
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown'}`)
    } finally {
      setIsSubmitting(false)
    }
  }, [formData.realDbId, formData.orderId, orderId, signatureName, getContractText, locale, t])

  const handleSubmit = useCallback(async () => {
    if (!canProceed()) return
    setIsSubmitting(true)
    const finalOrderId = formData.orderId || orderId
    const payload = {
      business_name: formData.businessName,
      business_email: formData.businessEmail,
      business_phone: formData.businessPhone,
      has_whatsapp: formData.hasWhatsapp,
      business_address: formData.businessAddress,
      niche: formData.niche,
      custom_niche: formData.customNiche,
      primary_city: formData.primaryCity,
      state: formData.state,
      service_areas: formData.serviceAreas,
      services: formData.services,
      primary_service: formData.primaryService,
      site_objective: formData.siteObjective,
      site_description: formData.siteDescription,
      selected_pages: formData.selectedPages,
      total_pages: formData.selectedPages.length,
      tone: formData.tone,
      primary_cta: formData.primaryCta,
      cta_text: formData.ctaText,
      primary_color: formData.primaryColor,
      secondary_color: formData.secondaryColor,
      accent_color: formData.accentColor,
      reference_sites: formData.referenceSites,
      design_notes: formData.designNotes,
      business_hours: formData.businessHours,
      social_facebook: formData.socialFacebook,
      social_instagram: formData.socialInstagram,
      social_linkedin: formData.socialLinkedin,
      social_youtube: formData.socialYoutube,
      testimonials: formData.testimonials,
      google_reviews_link: formData.googleReviewsLink,
      about_owner: formData.aboutOwner,
      years_in_business: formData.yearsInBusiness ? parseInt(formData.yearsInBusiness, 10) : null,
      desired_domain: formData.desiredDomain?.trim() || null,
      has_existing_domain: formData.hasExistingDomain,
      existing_domain: formData.hasExistingDomain ? formData.existingDomain?.trim() || null : null,
      domain_to_purchase: !formData.hasExistingDomain && formData.domainPurchased ? formData.domainToPurchase?.trim() || null : null,
      password: formData.password,
      is_complete: true,
      completed_steps: TOTAL_STEPS,
      locale,
    }
    try {
      const r = await fetch(`/api/launch/onboarding?order_id=${finalOrderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (r.ok) {
        try {
          const loginR = await fetch('/api/launch/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: formData.businessEmail, password: formData.password }),
          })
          if (loginR.ok) {
            const loginData = await loginR.json()
            if (loginData.access_token) {
              localStorage.setItem('customer_token', loginData.access_token)
              localStorage.setItem('customer_email', formData.businessEmail ?? '')
              if (loginData.customer_id) localStorage.setItem('customer_id', String(loginData.customer_id))
            }
            const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || 'https://portal.innexar.com.br'
            window.location.href = `${portalUrl}/${locale}`
          }
        } catch {
          // keep completion state
        }
        MetaPixel.completeRegistration({ content_name: 'Site Onboarding Complete', status: 'success' })
        localStorage.removeItem(storageKey)
        setIsComplete(true)
      } else {
        const errorData = await r.json().catch(() => ({}))
        let msg = 'Failed to submit'
        if (errorData.detail && typeof errorData.detail === 'string') msg = errorData.detail
        else if (Array.isArray(errorData.detail) && errorData.detail[0] && typeof (errorData.detail[0] as { msg?: string }).msg === 'string') msg = (errorData.detail[0] as { msg: string }).msg
        throw new Error(msg)
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [canProceed, formData, orderId, locale, storageKey])

  const fireConfetti = useCallback(() => {
    const duration = 3000
    const end = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 }
    const id = setInterval(() => {
      if (Date.now() >= end) return clearInterval(id)
      const count = 50 * ((end - Date.now()) / duration)
      confetti({ ...defaults, particleCount: count, origin: { x: 0.1 + Math.random() * 0.2, y: Math.random() - 0.2 } })
      confetti({ ...defaults, particleCount: count, origin: { x: 0.7 + Math.random() * 0.2, y: Math.random() - 0.2 } })
    }, 250)
  }, [])

  useEffect(() => {
    if (isComplete) {
      fireConfetti()
      const timer = setTimeout(
        () => router.push(`/launch/dashboard?order_id=${orderId ?? ''}&email=${encodeURIComponent(formData.businessEmail ?? '')}`),
        5000
      )
      return () => clearTimeout(timer)
    }
  }, [isComplete, fireConfetti, orderId, formData.businessEmail, router])

  return {
    t,
    currentStep,
    setCurrentStep,
    isSubmitting,
    isComplete,
    formData,
    updateField,
    serviceInput,
    setServiceInput,
    referenceInput,
    setReferenceInput,
    serviceAreaInput,
    setServiceAreaInput,
    isSigned,
    signatureName,
    setSignatureName,
    newTestimonial,
    setNewTestimonial,
    isCheckingEmail,
    emailExists,
    showLoginModal,
    setShowLoginModal,
    checkEmail,
    selectColorPalette,
    addService,
    removeService,
    addServiceArea,
    addReference,
    addTestimonial,
    togglePage,
    canProceed,
    getContractText,
    handleSignContract,
    handleSubmit,
    allowedPages,
  }
}
