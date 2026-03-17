'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  Menu, X, Globe, Smartphone, BrainCircuit, Link2, BarChart3,
  ChevronDown, Rocket, Code2, Headphones
} from 'lucide-react';
import { useSiteConfig } from '@/contexts/SiteConfigContext';

const services = [
  { href: '/services/web', icon: Globe, label: 'Sites Profissionais', desc: 'Landing pages e sites corporativos' },
  { href: '/services/apps', icon: Smartphone, label: 'Aplicativos', desc: 'Web e mobile sob medida' },
  { href: '/services/marketing', icon: BarChart3, label: 'Marketing Digital', desc: 'SEO, tráfego e conversão' },
  { href: '/prospector-ai', icon: BrainCircuit, label: 'ProspectorAI', desc: 'Prospecção com inteligência artificial' },
  { href: '/blockchain', icon: Link2, label: 'Blockchain', desc: 'Contratos inteligentes' },
  { href: '/services/infra', icon: Code2, label: 'Infraestrutura', desc: 'Cloud e DevOps' },
];

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/about', label: 'Sobre' },
  { href: '/contact', label: 'Contato' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { config } = useSiteConfig();
  const whatsapp = config.site_whatsapp_br || '5513991821557';
  const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent('Olá! Gostaria de saber mais sobre o ProspectorAI e os serviços da Innexar.')}`;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0D1B2A]/95 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
            <div className="relative w-36 h-9 md:w-44 md:h-11">
              <Image
                src="/logo-header.png"
                alt="Innexar"
                fill
                className="object-contain object-left brightness-0 invert"
                priority
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all duration-200"
              >
                {link.label}
              </Link>
            ))}

            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.06] rounded-lg transition-all duration-200"
                aria-expanded={servicesOpen}
              >
                Serviços
                <ChevronDown
                  size={14}
                  strokeWidth={1.5}
                  className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <>
                    <div className="fixed inset-0" onClick={() => setServicesOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="absolute left-0 top-full mt-2 w-72 bg-[#112233]/98 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-2 shadow-2xl"
                    >
                      {services.map(s => (
                        <Link
                          key={s.href}
                          href={s.href}
                          onClick={() => setServicesOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#00C9B1]/[0.08] group transition-colors duration-150"
                        >
                          <div className="w-9 h-9 rounded-lg bg-[#00C9B1]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#00C9B1]/20 transition-colors">
                            <s.icon size={16} strokeWidth={1.5} className="text-[#00C9B1]" aria-hidden="true" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white group-hover:text-[#00C9B1] transition-colors">{s.label}</p>
                            <p className="text-xs text-white/40">{s.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-white/15 text-white/80 rounded-full px-5 py-2 text-sm font-medium hover:border-[#00C9B1]/50 hover:text-[#00C9B1] hover:bg-[#00C9B1]/5 transition-all duration-200"
            >
              <Headphones size={15} strokeWidth={1.5} aria-hidden="true" />
              Suporte
            </a>
            <Link
              href="/criar-site"
              className="flex items-center gap-2 bg-gradient-to-r from-[#00C9B1] to-[#0A7EA4] text-white rounded-full px-6 py-2 text-sm font-semibold shadow-[0_4px_24px_rgba(0,201,177,0.3)] hover:shadow-[0_8px_32px_rgba(0,201,177,0.5)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <Rocket size={15} strokeWidth={1.5} aria-hidden="true" />
              Criar meu site
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/[0.07] transition-colors"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-[#0D1B2A]/98 backdrop-blur-xl border-t border-white/[0.06] overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-6 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-3 text-white/80 hover:text-white hover:bg-white/[0.06] rounded-xl text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="px-4 py-2">
                <p className="text-[10px] text-white/30 font-bold tracking-widest uppercase mb-3">Serviços</p>
                {services.map(s => (
                  <Link
                    key={s.href}
                    href={s.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 py-2.5 text-white/70 hover:text-[#00C9B1] transition-colors"
                  >
                    <s.icon size={16} strokeWidth={1.5} aria-hidden="true" />
                    <span className="text-sm font-medium">{s.label}</span>
                  </Link>
                ))}
              </div>
              <div className="pt-4 pb-2 flex flex-col gap-3">
                <Link
                  href="/criar-site"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#00C9B1] to-[#0A7EA4] text-white rounded-full px-6 py-3 text-sm font-semibold"
                >
                  <Rocket size={15} strokeWidth={1.5} aria-hidden="true" />
                  Criar meu site
                </Link>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 border border-white/15 text-white/70 rounded-full px-6 py-3 text-sm font-medium"
                >
                  <Headphones size={15} strokeWidth={1.5} aria-hidden="true" />
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
