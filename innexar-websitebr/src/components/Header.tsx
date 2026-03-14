'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import WhatsAppIcon from '@/components/WhatsAppIcon';

const WHATSAPP_FALLBACK_NUMBER = '5513991821557';
const WHATSAPP_DEFAULT_MESSAGE = 'Olá! Gostaria de saber mais sobre os sites.';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const t = useTranslations('navigation');
  const headerT = useTranslations('header');
  const locale = useLocale();

  const navigation: { key: string; name: string; href: string; highlight?: boolean }[] = [
    { key: 'home', name: t('home'), href: '/' },
    { key: 'criarSite', name: t('criarSite'), href: '/criar-site', highlight: true },
    { key: 'services', name: t('services'), href: '/services' },
    { key: 'prospectorAi', name: t('prospectorAi'), href: '/prospector-ai' },
    { key: 'about', name: t('about'), href: '/about' },
    { key: 'blockchain', name: t('blockchain'), href: '/blockchain' },
    { key: 'contact', name: t('contact'), href: '/contact' },
  ];

  const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

  // ... (inside component)
  const { config } = useSiteConfig();

  // Dynamic values with fallback to translations
  const topEmailValue = config.sales_email || headerT('top.emailValue');

  // Construct phones list dynamically or use trans
  const brPhone = config.site_phone_br;
  const brPhoneClean = config.site_whatsapp_br || brPhone?.replace(/\D/g, '') || '';
  const whatsappNumber = brPhoneClean || WHATSAPP_FALLBACK_NUMBER;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`;

  const dynamicPhones = [{
    label: 'Brasil',
    display: '(13) 99182-1557',
    href: whatsappNumber
  }];

  const topPhones = dynamicPhones;
  const topCta = headerT('top.cta');

  const changeLanguage = (newLocale: string) => {
    setLanguageMenuOpen(false);
    setMobileMenuOpen(false);

    // Pega o caminho atual sem o locale
    const currentPath = globalThis.location?.pathname || '/';
    // Remove o locale atual do path
    const pathWithoutLocale = currentPath.replace(`/${locale}`, '') || '/';

    // Navega para o novo locale
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    globalThis.location?.assign(newPath);
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 overflow-visible">
      <div className="hidden lg:block bg-slate-900 text-slate-100 text-sm overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 min-h-[44px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 xl:gap-6 min-w-0 flex-1">
            <a
              href={`mailto:${topEmailValue}`}
              className="flex items-center gap-2 hover:text-cyan-300 transition-colors shrink-0 truncate max-w-[220px] xl:max-w-none"
              title={topEmailValue}
            >
              <EnvelopeIcon className="h-4 w-4 shrink-0" />
              <span className="truncate">{topEmailValue}</span>
            </a>
            {topPhones.map((phone) => (
              <a
                key={phone.display}
                href={`tel:${phone.href}`}
                className="flex items-center gap-2 hover:text-cyan-300 transition-colors shrink-0"
              >
                <PhoneIcon className="h-4 w-4" />
                <span className="hidden xl:inline whitespace-nowrap">
                  {phone.label} • {phone.display}
                </span>
                <span className="xl:hidden whitespace-nowrap">{phone.display}</span>
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Abrir conversa no WhatsApp"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#25D366] text-white hover:bg-[#20BD5A] transition-colors whitespace-nowrap"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span>Fale no WhatsApp</span>
            </a>
            <Link
              href="/contact"
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-white text-slate-900 hover:bg-cyan-200 transition-colors whitespace-nowrap"
            >
              {topCta}
            </Link>
          </div>
        </div>
      </div>
      <div className="bg-white/95 backdrop-blur-md shadow-sm">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo - wrapper preserva proporção (evita distorção) */}
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

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:gap-x-2 lg:items-center">
              {navigation.map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className={item.highlight
                    ? "relative inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg text-violet-700 bg-violet-50 hover:bg-violet-100 hover:text-violet-800 border border-violet-200 transition-all duration-200"
                    : "relative px-5 py-2.5 text-sm font-medium rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  }
                >
                  {item.highlight && <span className="shrink-0" aria-hidden>⚡</span>}
                  <span className="whitespace-nowrap">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* Language Selector & CTA */}
            <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 lg:items-center">
              {/* WhatsApp - official button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir conversa no WhatsApp"
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-lg bg-[#25D366] hover:bg-[#20BD5A] transition-colors shadow-sm"
              >
                <WhatsAppIcon className="h-5 w-5" />
                <span>WhatsApp</span>
              </a>
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className="flex items-center gap-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition-all duration-200"
                >
                  <GlobeAltIcon className="h-5 w-5" />
                  <span>{currentLanguage.flag}</span>
                  <span className="uppercase">{currentLanguage.code}</span>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>

                <AnimatePresence>
                  {languageMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          className="flex items-center gap-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <span>{lang.flag}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Portal Button - external app */}
              <a
                href={`${process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.innexar.com.br"}/${locale}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Portal
              </a>

              {/* CTA para landing de sites */}
              <Link
                href="/criar-site"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:from-cyan-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
              >
                {t('getStarted')}
              </Link>
            </div>

            {/* Mobile: WhatsApp icon + menu button */}
            <div className="flex lg:hidden items-center gap-1">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir conversa no WhatsApp"
                className="p-2.5 rounded-lg bg-[#25D366] text-white hover:bg-[#20BD5A] transition-colors"
              >
                <WhatsAppIcon className="h-6 w-6" />
              </a>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg p-2.5 text-gray-700 hover:bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <span className="sr-only">Toggle menu</span>
                {mobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden overflow-hidden"
              >
                <div className="space-y-2 pb-4 pt-2">
                  {/* Mobile WhatsApp CTA */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold text-white bg-[#25D366] hover:bg-[#20BD5A]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    Fale no WhatsApp
                  </a>
                  {navigation.map((item) => (
                    <Link
                      key={item.key}
                      href={item.href}
                      className="block px-4 py-3 text-base font-medium rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}

                  {/* Mobile Language Selector */}
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={`flex items-center gap-x-3 w-full px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${lang.code === locale
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Mobile Portal Button - external app */}
                  <a
                    href={`${process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.innexar.com.br"}/${locale}`}
                    className="flex items-center justify-center gap-2 mt-4 px-4 py-3 text-base font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Portal do Cliente
                  </a>

                  {/* Mobile CTA para landing de sites */}
                  <Link
                    href="/criar-site"
                    className="block mt-2 px-4 py-3 text-center text-base font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:from-cyan-600 hover:to-blue-700 shadow-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('getStarted')}
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </header>
  );
}
