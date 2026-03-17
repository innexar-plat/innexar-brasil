'use client';

import { EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { Link } from '@/i18n/navigation';
import WhatsAppIcon from '@/components/WhatsAppIcon';

export type TopPhone = { label: string; display: string; href: string };

type HeaderTopBarProps = {
  topEmailValue: string;
  topPhones: TopPhone[];
  whatsappUrl: string;
  topCta: string;
};

export function HeaderTopBar({ topEmailValue, topPhones, whatsappUrl, topCta }: HeaderTopBarProps) {
  return (
    <div className="hidden lg:block bg-slate-800/90 text-slate-200 text-sm overflow-visible border-b border-slate-700/50">
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
  );
}
