'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Globe, Smartphone, BrainCircuit, Link2, BarChart3, Code2, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Globe,
    title: 'Sites Profissionais',
    desc: 'Landing pages e sites corporativos modernos, rápidos e otimizados para o Google. Design exclusivo, responsivo e com identidade visual da sua marca.',
    href: '/services/web',
    badge: 'Mais popular',
  },
  {
    icon: Smartphone,
    title: 'Aplicativos Web e Mobile',
    desc: 'Desenvolvemos apps completos sob medida — do protótipo ao deploy em produção, com UX pensado para conversão e escalabilidade.',
    href: '/services/apps',
    badge: null,
  },
  {
    icon: BarChart3,
    title: 'Marketing Digital',
    desc: 'SEO avançado, Google Ads, Meta Ads e estratégias de crescimento orgânico. Apareça no topo do Google e atraia clientes qualificados.',
    href: '/services/marketing',
    badge: null,
  },
  {
    icon: BrainCircuit,
    title: 'ProspectorAI',
    desc: 'Prospecção inteligente com IA. Encontre leads qualificados automaticamente, automatize o outreach e escale suas vendas com inteligência artificial.',
    href: '/prospector-ai',
    badge: 'Novo',
  },
  {
    icon: Link2,
    title: 'Blockchain',
    desc: 'Contratos inteligentes, tokenização de ativos e soluções descentralizadas para empresas que querem estar na vanguarda da Web3.',
    href: '/blockchain',
    badge: null,
  },
  {
    icon: Code2,
    title: 'Infraestrutura & Cloud',
    desc: 'AWS, GCP, Azure e VPS gerenciados. CI/CD, Docker, Kubernetes e DevOps para garantir disponibilidade, segurança e performance.',
    href: '/services/infra',
    badge: null,
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
};

export default function Services() {
  return (
    <section className="py-24 md:py-32 bg-[#0D1B2A] relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#00C9B1]/[0.04] blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-[#00C9B1]/12 border border-[#00C9B1]/30 rounded-full px-4 py-1.5 text-[11px] text-[#00C9B1] font-bold tracking-[2px] uppercase font-['DM_Sans'] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C9B1] animate-pulse" />
            Nossos Serviços
          </span>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white mb-5">
            Tudo que seu negócio<br />precisa para crescer online
          </h2>
          <p className="font-['DM_Sans'] text-lg text-white/45 max-w-2xl mx-auto">
            Da criação ao crescimento — soluções completas de tecnologia para empresas que querem resultados reais.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {services.map((service, i) => (
            <motion.div key={i} variants={itemVariants}>
              <Link
                href={service.href}
                className="group flex flex-col h-full bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 hover:border-[#00C9B1]/25 hover:-translate-y-1 transition-all duration-300 block"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-[#00C9B1]/10 flex items-center justify-center group-hover:bg-[#00C9B1]/20 transition-colors duration-200">
                    <service.icon size={22} strokeWidth={1.5} className="text-[#00C9B1]" aria-hidden="true" />
                  </div>
                  {service.badge && (
                    <span className="text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full bg-[#00C9B1]/15 text-[#00C9B1] font-['DM_Sans']">
                      {service.badge}
                    </span>
                  )}
                </div>
                <h3 className="font-['Playfair_Display'] text-xl font-bold text-white mb-3 group-hover:text-[#00C9B1] transition-colors duration-200">
                  {service.title}
                </h3>
                <p className="font-['DM_Sans'] text-sm text-white/45 leading-relaxed flex-1 mb-5">
                  {service.desc}
                </p>
                <div className="flex items-center gap-2 text-sm text-[#00C9B1] font-semibold font-['DM_Sans'] group-hover:gap-3 transition-all duration-200">
                  Saiba mais
                  <ArrowRight size={15} strokeWidth={1.5} aria-hidden="true" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
