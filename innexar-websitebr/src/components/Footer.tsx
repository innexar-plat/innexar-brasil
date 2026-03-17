import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Globe, Smartphone, BrainCircuit, Link2, BarChart3, Code2, Linkedin, Github, Instagram } from 'lucide-react';

const services = [
  { href: '/services/web', icon: Globe, label: 'Sites Profissionais' },
  { href: '/services/apps', icon: Smartphone, label: 'Aplicativos' },
  { href: '/services/marketing', icon: BarChart3, label: 'Marketing Digital' },
  { href: '/prospector-ai', icon: BrainCircuit, label: 'ProspectorAI' },
  { href: '/blockchain', icon: Link2, label: 'Blockchain' },
  { href: '/services/infra', icon: Code2, label: 'Infraestrutura' },
];

const company = [
  { href: '/about', label: 'Sobre nós' },
  { href: '/contact', label: 'Contato' },
  { href: '/criar-site', label: 'Criar meu site' },
  { href: '/privacy-policy', label: 'Privacidade' },
];

const social = [
  { href: 'https://linkedin.com/company/innexar', icon: Linkedin, label: 'LinkedIn' },
  { href: 'https://github.com/innexar-plat', icon: Github, label: 'GitHub' },
  { href: 'https://instagram.com/innexar', icon: Instagram, label: 'Instagram' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#0a1520] border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Main footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-5">
              <div className="relative w-36 h-9">
                <Image
                  src="/logo-header.png"
                  alt="Innexar"
                  fill
                  className="object-contain object-left brightness-0 invert"
                />
              </div>
            </Link>
            <p className="font-['DM_Sans'] text-sm text-white/40 leading-relaxed mb-6 max-w-xs">
              Agência digital especializada em sites profissionais, apps e inteligência artificial para empresas brasileiras.
            </p>
            <div className="flex gap-3">
              {social.map(s => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.07] flex items-center justify-center hover:bg-[#00C9B1]/10 hover:border-[#00C9B1]/30 transition-all duration-200"
                >
                  <s.icon size={15} strokeWidth={1.5} className="text-white/50 hover:text-[#00C9B1]" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-['DM_Sans'] text-xs font-bold tracking-widest uppercase text-white/30 mb-5">Serviços</h3>
            <ul className="space-y-3">
              {services.map(s => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="flex items-center gap-2 text-sm text-white/45 hover:text-[#00C9B1] font-['DM_Sans'] transition-colors duration-200"
                  >
                    <s.icon size={13} strokeWidth={1.5} aria-hidden="true" />
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-['DM_Sans'] text-xs font-bold tracking-widest uppercase text-white/30 mb-5">Empresa</h3>
            <ul className="space-y-3">
              {company.map(c => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-sm text-white/45 hover:text-[#00C9B1] font-['DM_Sans'] transition-colors duration-200"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-['DM_Sans'] text-xs font-bold tracking-widest uppercase text-white/30 mb-5">Contato</h3>
            <ul className="space-y-4">
              <li>
                <a href="mailto:comercial@innexar.app" className="flex items-start gap-2.5 text-sm text-white/45 hover:text-[#00C9B1] font-['DM_Sans'] transition-colors duration-200">
                  <Mail size={14} strokeWidth={1.5} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
                  comercial@innexar.app
                </a>
              </li>
              <li>
                <a href="tel:+5513991821557" className="flex items-start gap-2.5 text-sm text-white/45 hover:text-[#00C9B1] font-['DM_Sans'] transition-colors duration-200">
                  <Phone size={14} strokeWidth={1.5} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
                  (13) 99182-1557
                </a>
              </li>
              <li>
                <div className="flex items-start gap-2.5 text-sm text-white/35 font-['DM_Sans']">
                  <MapPin size={14} strokeWidth={1.5} className="mt-0.5 flex-shrink-0 text-white/30" aria-hidden="true" />
                  <span>Praia Grande – SP, Brasil</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.05] py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-['DM_Sans'] text-xs text-white/25">
            © {year} Innexar — Todos os direitos reservados.
          </p>
          <p className="font-['DM_Sans'] text-xs text-white/20">
            CNPJ: 00.000.000/0001-00 · Praia Grande, São Paulo
          </p>
        </div>
      </div>
    </footer>
  );
}