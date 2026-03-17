export const TOTAL_STEPS = 8

export interface Testimonial {
  name: string
  text: string
  role?: string
}

export interface FormData {
  businessName: string
  businessEmail: string
  businessPhone: string
  hasWhatsapp: boolean
  businessAddress: string
  niche: string
  customNiche: string
  primaryCity: string
  state: string
  serviceAreas: string[]
  services: string[]
  primaryService: string
  siteObjective: string
  siteDescription: string
  selectedPages: string[]
  tone: string
  primaryCta: string
  ctaText: string
  colorPalette: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  referenceSites: string[]
  designNotes: string
  businessHours: Record<string, string>
  socialFacebook: string
  socialInstagram: string
  socialLinkedin: string
  socialYoutube: string
  testimonials: Testimonial[]
  googleReviewsLink: string
  aboutOwner: string
  yearsInBusiness: string
  desiredDomain: string
  hasExistingDomain: boolean
  existingDomain: string
  domainToPurchase: string
  domainPurchased: boolean
  password?: string
  confirmPassword?: string
  orderId?: string
  realDbId?: number
}

export type UpdateFieldFn = <K extends keyof FormData>(field: K, value: FormData[K]) => void

export const colorPalettes = [
  { id: 'blue', primary: '#2563eb', secondary: '#1e40af', accent: '#3b82f6', name: 'Professional Blue' },
  { id: 'green', primary: '#059669', secondary: '#047857', accent: '#10b981', name: 'Trust Green' },
  { id: 'purple', primary: '#7c3aed', secondary: '#6d28d9', accent: '#8b5cf6', name: 'Creative Purple' },
  { id: 'red', primary: '#dc2626', secondary: '#b91c1c', accent: '#ef4444', name: 'Bold Red' },
  { id: 'orange', primary: '#ea580c', secondary: '#c2410c', accent: '#f97316', name: 'Energy Orange' },
  { id: 'teal', primary: '#0d9488', secondary: '#0f766e', accent: '#14b8a6', name: 'Fresh Teal' },
  { id: 'slate', primary: '#475569', secondary: '#334155', accent: '#64748b', name: 'Modern Slate' },
  { id: 'custom', primary: '', secondary: '', accent: '', name: 'Custom Colors' },
]

export const brStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

export const brStateNames: Record<string, string> = {
  'AC': 'Acre', 'AL': 'Alagoas', 'AP': 'Amapá', 'AM': 'Amazonas',
  'BA': 'Bahia', 'CE': 'Ceará', 'DF': 'Distrito Federal', 'ES': 'Espírito Santo',
  'GO': 'Goiás', 'MA': 'Maranhão', 'MT': 'Mato Grosso', 'MS': 'Mato Grosso do Sul',
  'MG': 'Minas Gerais', 'PA': 'Pará', 'PB': 'Paraíba', 'PR': 'Paraná',
  'PE': 'Pernambuco', 'PI': 'Piauí', 'RJ': 'Rio de Janeiro', 'RN': 'Rio Grande do Norte',
  'RS': 'Rio Grande do Sul', 'RO': 'Rondônia', 'RR': 'Roraima', 'SC': 'Santa Catarina',
  'SP': 'São Paulo', 'SE': 'Sergipe', 'TO': 'Tocantins',
}
