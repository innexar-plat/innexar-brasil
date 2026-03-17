'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { ChevronDown } from 'lucide-react';
import WhatsAppIcon from '@/components/WhatsAppIcon';
import { ServicesDropdown } from './ServicesDropdown';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
] as const;

export type NavItem = {
  key: string;
  name: string;
  href: string;
  highlight?: boolean;
  isDropdown?: boolean;
};

type ServiceItem = { key: string; href: string; label: string };

type HeaderNavDesktopProps = {
  navigation: NavItem[];
  serviceItems: ServiceItem[];
  whatsappUrl: string;
  locale: string;
};

export function HeaderNavDesktop({
  navigation,
  serviceItems,
  whatsappUrl,
  locale,
}: HeaderNavDesktopProps) {
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const t = useTranslations('navigation');
  const currentLanguage = LANGUAGES.find((lang) => lang.code === locale) ?? LANGUAGES[0];

  const changeLanguage = (newLocale: string) => {
    setLanguageMenuOpen(false);
    const currentPath = globalThis.location?.pathname || '/';
    const pathWithoutLocale = currentPath.replace(`/${locale}`, '') || '/';
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    globalThis.location?.assign(newPath);
  };

  return (
    <>
    <div className="hidden lg:flex lg:gap-x-2 lg:items-center">
      {navigation.map((item) => {
        if (item.isDropdown) {
          return (
            <ServicesDropdown
              key={item.key}
              triggerLabel={item.name}
              items={serviceItems}
            />
          );
        }
        if (item.highlight) {
          return (
            <Link
              key={item.key}
              href={item.href}
              className="relative inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <span className="shrink-0" aria-hidden>⚡</span>
              <span className="whitespace-nowrap">{item.name}</span>
            </Link>
          );
        }
        return (
          <Link
            key={item.key}
            href={item.href}
            className="relative px-5 py-2.5 text-sm font-medium rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-all duration-200"
          >
            <span className="whitespace-nowrap">{item.name}</span>
          </Link>
        );
      })}
    </div>

    <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 lg:items-center">
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
      <div className="relative">
        <button
          onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
          className="flex items-center gap-x-2 px-3 py-2 text-sm font-medium text-slate-200 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-200"
        >
          <GlobeAltIcon className="h-5 w-5" />
          <span>{currentLanguage.flag}</span>
          <span className="uppercase">{currentLanguage.code}</span>
          <ChevronDown className="h-4 w-4" />
        </button>
        <AnimatePresence>
          {languageMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="absolute right-0 mt-2 w-48 bg-zinc-900 rounded-lg shadow-xl border border-zinc-700 py-2"
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className="flex items-center gap-x-3 w-full px-4 py-2 text-sm text-slate-200 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <a
        href={`${process.env.NEXT_PUBLIC_PORTAL_URL || 'https://portal.innexar.com.br'}/${locale}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-200 hover:text-white rounded-lg hover:bg-white/10 transition-all duration-200 border border-zinc-600"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        Portal
      </a>
      <Link
        href="/criar-site"
        className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:from-cyan-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
      >
        {t('getStarted')}
      </Link>
    </div>
    </>
  );
}
