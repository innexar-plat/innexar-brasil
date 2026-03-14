import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Footer from '@/components/Footer'
import { generateMetadata as genMeta } from '@/lib/seo'

const ProspectorAiLaunchSection = dynamic(() => import('@/components/ProspectorAiLaunchSection'), { ssr: true })
const LaunchBanner = dynamic(() => import('@/components/LaunchBanner'), { ssr: true })
const Services = dynamic(() => import('@/components/Services'), { ssr: true })
const SuccessStories = dynamic(() => import('@/components/SuccessStories'), { ssr: true })
const ProcessSection = dynamic(() => import('@/components/ProcessSection'), { ssr: true })
const Technologies = dynamic(() => import('@/components/Technologies'), { ssr: true })
const EngagementModels = dynamic(() => import('@/components/EngagementModels'), { ssr: true })
const Testimonials = dynamic(() => import('@/components/Testimonials'), { ssr: true })
const LeadMagnet = dynamic(() => import('@/components/LeadMagnet'), { ssr: true })
const About = dynamic(() => import('@/components/About'), { ssr: true })
const Contact = dynamic(() => import('@/components/Contact'), { ssr: true })

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return genMeta(locale, 'home')
}

export default async function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Suspense fallback={null}>
        <ProspectorAiLaunchSection />
        <LaunchBanner />
        <Services />
        <SuccessStories />
        <ProcessSection />
        <Technologies />
        <EngagementModels />
        <Testimonials />
        <LeadMagnet />
        <About />
        <Contact />
      </Suspense>
      <Footer />
    </main>
  )
}
