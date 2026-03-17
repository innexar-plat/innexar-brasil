import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import type { Metadata } from 'next';

const Services = dynamic(() => import('@/components/Services'), { ssr: true });
const Testimonials = dynamic(() => import('@/components/Testimonials'), { ssr: true });
const CTASection = dynamic(() => import('@/components/CTASection'), { ssr: true });

export const metadata: Metadata = {
  title: 'Innexar — Sites, Apps e IA para seu Negócio',
  description: 'Agência digital especializada em criação de sites profissionais, aplicativos e soluções com inteligência artificial. Transforme seu negócio digital com a Innexar.',
};

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <Services />
      <Testimonials />
      <CTASection />
      <Footer />
    </main>
  );
}
