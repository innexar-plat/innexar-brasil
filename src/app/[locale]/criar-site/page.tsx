import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CriarSiteContent from '@/components/criar-site/CriarSiteContent';
import { generateMetadata as genMeta } from '@/lib/seo';
import { getTranslations } from 'next-intl/server';
import StructuredDataFAQ from '@/components/StructuredDataFAQ';
import StructuredDataBreadcrumb from '@/components/StructuredDataBreadcrumb';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://innexar.com.br';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return genMeta(locale, 'criar-site');
}

export default async function CriarSitePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('criarSite.faq');
  const faqItems = [
    { question: t('q1'), answer: t('a1') },
    { question: t('q2'), answer: t('a2') },
    { question: t('q3'), answer: t('a3') },
    { question: t('q4'), answer: t('a4') },
  ];
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <StructuredDataBreadcrumb
        baseUrl={SITE_URL}
        locale={locale}
        items={[{ name: 'Criar site', slug: 'criar-site' }]}
      />
      <StructuredDataFAQ
        items={faqItems}
        locale={locale}
        baseUrl={SITE_URL}
        pagePath="/criar-site"
      />
      <Header />
      <CriarSiteContent />
      <Footer />
    </main>
  );
}
