'use client';

import { Link } from '@/i18n/navigation';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export type ServiceItem = { key: string; href: string; label: string };

type ServicesDropdownProps = {
  triggerLabel: string;
  items: ServiceItem[];
};

export function ServicesDropdown({ triggerLabel, items }: ServicesDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-lg border-0 bg-transparent cursor-pointer"
      >
        {triggerLabel}
        <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 bg-zinc-900 border-zinc-700">
        <DropdownMenuLabel className="text-slate-300">{triggerLabel}</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-700" />
        {items.map((svc) => (
          <DropdownMenuItem
            key={svc.key}
            className="text-slate-200 focus:bg-zinc-800 focus:text-white cursor-pointer"
          >
            <Link href={svc.href} className="block w-full">
              {svc.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
