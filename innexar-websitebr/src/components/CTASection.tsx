'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Rocket, CalendarDays, CheckCircle2 } from 'lucide-react';

const benefits = [
  'Entrega em até 7 dias úteis',
  'Design exclusivo para sua marca',
  'SEO otimizado desde o primeiro dia',
  'Suporte incluso por 3 meses',
  'Hospedagem profissional',
  'Site 100% responsivo',
];

export default function CTASection() {
  const whatsappUrl = `https://wa.me/5513991821557?text=${encodeURIComponent('Olá! Gostaria de agendar uma call e saber mais sobre os serviços da Innexar.')}`;

  return (
    <section className="py-24 md:py-32 bg-[#0D1B2A] relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#00C9B1]/[0.06] via-transparent to-[#0A7EA4]/[0.08]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#00C9B1]/[0.05] blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-10 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: '-80px' }}
        >
          <span className="inline-flex items-center gap-2 bg-[#00C9B1]/12 border border-[#00C9B1]/30 rounded-full px-4 py-1.5 text-[11px] text-[#00C9B1] font-bold tracking-[2px] uppercase font-['DM_Sans'] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C9B1] animate-pulse" />
            Comece hoje
          </span>

          <h2 className="font-['Playfair_Display'] text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Pronto para ter o site
            <br />
            <span className="bg-gradient-to-r from-[#00C9B1] via-[#FF9B4E] to-[#FF6B47] bg-clip-text text-transparent">
              que seu negócio merece?
            </span>
          </h2>

          <p className="font-['DM_Sans'] text-xl text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed">
            Mais de 120 empresas já transformaram sua presença digital com a Innexar. Sua vez.
          </p>

          {/* Benefits */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-12 max-w-2xl mx-auto">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-white/55 font-['DM_Sans']">
                <CheckCircle2 size={15} strokeWidth={1.5} className="text-[#00C9B1] flex-shrink-0" aria-hidden="true" />
                {b}
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/criar-site"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#00C9B1] to-[#0A7EA4] text-white rounded-full px-10 py-4 text-base font-semibold font-['DM_Sans'] shadow-[0_8px_32px_rgba(0,201,177,0.35)] hover:shadow-[0_14px_40px_rgba(0,201,177,0.55)] hover:-translate-y-1 transition-all duration-300"
            >
              <Rocket size={20} strokeWidth={1.5} aria-hidden="true" />
              Criar meu site agora
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white/15 text-white/70 rounded-full px-9 py-4 text-base font-medium font-['DM_Sans'] hover:border-[#00C9B1]/50 hover:text-[#00C9B1] hover:bg-[#00C9B1]/5 transition-all duration-200"
            >
              <CalendarDays size={20} strokeWidth={1.5} aria-hidden="true" />
              Agendar uma call gratuita
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
