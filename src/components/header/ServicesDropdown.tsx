'use client';

import { useState, useRef, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import { ChevronDown } from 'lucide-react';

export type ServiceItem = { key: string; href: string; label: string };

type ServicesDropdownProps = {
  triggerLabel: string;
  items: ServiceItem[];
};

export function ServicesDropdown({ triggerLabel, items }: ServicesDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-lg border-0 bg-transparent cursor-pointer"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {triggerLabel}
        <ChevronDown className="h-4 w-4" />
      </button>
      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-1 w-56 rounded-lg bg-slate-800 border border-slate-600 shadow-xl py-1"
          role="menu"
        >
          <div className="px-3 py-2 text-xs font-medium text-slate-400 border-b border-slate-600">
            {triggerLabel}
          </div>
          {items.map((svc) => (
            <Link
              key={svc.key}
              href={svc.href}
              className="block px-3 py-2 text-sm text-slate-200 hover:bg-white/10 hover:text-white transition-colors"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              {svc.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
