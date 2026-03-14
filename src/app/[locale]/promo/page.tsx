import PromoPageClient from '@/components/promo/PromoPageClient'
import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://innexar.com.br'
const PROMO_PATH = '/promo'

type Props = {
    params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params

    const titles = {
        en: 'Professional Website in 48 Hours - $199 | Innexar',
        pt: 'Site Profissional em 48 Horas - $199 | Innexar',
        es: 'Sitio Profesional en 48 Horas - $199 | Innexar'
    }

    const descriptions = {
        en: '3-page website built for your business. Mobile-friendly, hosting included, delivered in 48 hours. No monthly fees.',
        pt: 'Site de 3 páginas criado para seu negócio. Design responsivo, hospedagem incluída, entregue em 48 horas. Sem mensalidades.',
        es: 'Sitio de 3 páginas creado para tu negocio. Diseño responsive, hosting incluido, entregado en 48 horas. Sin cuotas mensuales.'
    }

    const title = titles[locale as keyof typeof titles] || titles.en
    const description = descriptions[locale as keyof typeof descriptions] || descriptions.en
    const url = `${SITE_URL}/${locale}${PROMO_PATH}`

    return {
        title,
        description,
        metadataBase: new URL(SITE_URL),
        alternates: {
            canonical: url,
            languages: {
                'x-default': `${SITE_URL}/pt${PROMO_PATH}`,
                pt: `${SITE_URL}/pt${PROMO_PATH}`,
                en: `${SITE_URL}/en${PROMO_PATH}`,
                es: `${SITE_URL}/es${PROMO_PATH}`,
            },
        },
        openGraph: {
            type: 'website',
            url,
            title,
            description,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        }
    }
}

export default function PromoPage() {
    return <PromoPageClient />
}
