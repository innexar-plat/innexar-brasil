'use client';

import { Link } from '@/i18n/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import WhatsAppIcon from '@/components/WhatsAppIcon';

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

type HeaderNavMobileProps = {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  navigation: NavItem[];
  serviceItems: ServiceItem[];
  whatsappUrl: string;
  locale: string;
  servicesLabel: string;
  getStartedLabel: string;
};

export function HeaderNavMobile({
  mobileMenuOpen,
  setMobileMenuOpen,
  navigation,
  serviceItems,
  whatsappUrl,
  locale,
  servicesLabel,
  getStartedLabel,
}: HeaderNavMobileProps) {
  const changeLanguage = (newLocale: string) => {
    setMobileMenuOpen(false);
    const currentPath = globalThis.location?.pathname || '/';
    const pathWithoutLocale = currentPath.replace(`/${locale}`, '') || '/';
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    globalThis.location?.assign(newPath);
  };

  return (
    <>
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
          className="inline-flex items-center justify-center rounded-lg p-2.5 text-slate-200 hover:bg-white/10"
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

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="lg:hidden overflow-hidden border-t border-zinc-800 bg-zinc-950/95"
          >
            <div className="space-y-1 pb-4 pt-2 px-2">
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
              {navigation.filter((item) => !item.isDropdown).map((item) => (
                <Link
                  key={item.key}
                  href={item.href}
                  className="block px-4 py-3 text-base font-medium rounded-lg text-slate-200 hover:text-white hover:bg-white/10 transition-all duration-200"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-4 py-2">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {servicesLabel}
                </span>
                <div className="mt-1 space-y-1">
                  {serviceItems.map((svc) => (
                    <Link
                      key={svc.key}
                      href={svc.href}
                      className="block px-4 py-2.5 text-sm rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {svc.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-zinc-800 space-y-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`flex items-center gap-x-3 w-full px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${lang.code === locale ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </button>
                ))}
              </div>
              <a
                href={`${process.env.NEXT_PUBLIC_PORTAL_URL || 'https://portal.innexar.com.br'}/${locale}`}
                className="flex items-center justify-center gap-2 mt-2 px-4 py-3 text-base font-medium text-slate-200 border border-zinc-600 rounded-lg hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Portal do Cliente
              </a>
              <Link
                href="/criar-site"
                className="block mt-2 px-4 py-3 text-center text-base font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:from-cyan-600 hover:to-blue-700 shadow-md"
                onClick={() => setMobileMenuOpen(false)}
              >
                {getStartedLabel}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
