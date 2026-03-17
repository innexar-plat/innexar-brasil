'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import { HeaderTopBar, type TopPhone } from '@/components/header/HeaderTopBar';
import { HeaderNavDesktop } from '@/components/header/HeaderNavDesktop';
import { HeaderNavMobile } from '@/components/header/HeaderNavMobile';

const WHATSAPP_FALLBACK_NUMBER = '5513991821557';
const WHATSAPP_DEFAULT_MESSAGE = 'Olá! Gostaria de saber mais sobre os sites.';

const SERVICE_ITEMS = [
  { key: 'servicesApps', href: '/services/apps' },
  { key: 'servicesWeb', href: '/services/web' },
  { key: 'servicesMarketing', href: '/services/marketing' },
  { key: 'servicesInfra', href: '/services/infra' },
] as const;

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations('navigation');
  const headerT = useTranslations('header');
  const locale = useLocale();
  const { config } = useSiteConfig();

  const topEmailValue = config.sales_email || headerT('top.emailValue');
  const brPhone = config.site_phone_br;
  const brPhoneClean = config.site_whatsapp_br || brPhone?.replace(/\D/g, '') || '';
  const whatsappNumber = brPhoneClean || WHATSAPP_FALLBACK_NUMBER;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`;

  const topPhones: TopPhone[] = [{
    label: 'Brasil',
    display: '(13) 99182-1557',
    href: whatsappNumber,
  }];

  const navigation = [
    { key: 'home', name: t('home'), href: '/' },
    { key: 'services', name: t('services'), href: '/services', isDropdown: true },
    { key: 'prospectorAi', name: t('prospectorAi'), href: '/prospector-ai' },
    { key: 'about', name: t('about'), href: '/about' },
    { key: 'blockchain', name: t('blockchain'), href: '/blockchain' },
    { key: 'contact', name: t('contact'), href: '/contact' },
    { key: 'criarSite', name: t('criarSite'), href: '/criar-site', highlight: true },
  ];

  const serviceItemsWithLabels = SERVICE_ITEMS.map((svc) => ({
    ...svc,
    label: t(svc.key),
  }));

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 overflow-visible">
      <HeaderTopBar
        topEmailValue={topEmailValue}
        topPhones={topPhones}
        whatsappUrl={whatsappUrl}
        topCta={headerT('top.cta')}
      />
      <div className="bg-zinc-950/90 backdrop-blur-lg border-b border-zinc-800">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex lg:flex-1">
              <Link href="/" className="flex items-center group">
                <span className="relative block h-14 w-[180px] shrink-0">
                  <Image
                    src="/logo-header.png"
                    alt="Innexar"
                    fill
                    className="object-contain object-left transition-transform duration-300 group-hover:scale-105"
                    sizes="180px"
                    priority
                  />
                </span>
              </Link>
            </div>
            <HeaderNavDesktop
              navigation={navigation}
              serviceItems={serviceItemsWithLabels}
              whatsappUrl={whatsappUrl}
              locale={locale}
            />
            <HeaderNavMobile
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
              navigation={navigation}
              serviceItems={serviceItemsWithLabels}
              whatsappUrl={whatsappUrl}
              locale={locale}
              servicesLabel={t('services')}
              getStartedLabel={t('getStarted')}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
