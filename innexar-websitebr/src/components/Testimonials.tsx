'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Camila Ferreira',
    role: 'CEO',
    company: 'Studio Beleza & Co.',
    text: 'O site ficou incrível! Em 3 meses triplicamos os agendamentos pelo site. A Innexar entregou além do que esperávamos — design impecável e carregamento ultrarrápido.',
    rating: 5,
    initials: 'CF',
  },
  {
    name: 'Rafael Andrade',
    role: 'Fundador',
    company: 'RA Imóveis',
    text: 'Profissionalismo do início ao fim. O site gerou mais de 80 leads qualificados no primeiro mês. Suporte rápido e equipe que realmente entende de negócios.',
    rating: 5,
    initials: 'RA',
  },
  {
    name: 'Dr. Lucas Mendes',
    role: 'Diretor',
    company: 'Clínica OralPrime',
    text: 'A Innexar modernizou toda a nossa presença digital. Novo site, Google Ads e SEO — resultado: 45% mais consultas em 60 dias. Recomendo demais!',
    rating: 5,
    initials: 'LM',
  },
  {
    name: 'Mariana Costa',
    role: 'Diretora de TI',
    company: 'LogisTech Brasil',
    text: 'Desenvolveram nosso app interno em tempo recorde. A qualidade do código é excelente e o app está em produção há 1 ano sem nenhum problema crítico.',
    rating: 5,
    initials: 'MC',
  },
  {
    name: 'Pedro Alves',
    role: 'Sócio',
    company: 'Alves & Farias Advogados',
    text: 'Queríamos um site que transmitisse autoridade e confiança. A Innexar entregou exatamente isso — moderno, profissional e com formulário que converteu muito.',
    rating: 5,
    initials: 'PA',
  },
  {
    name: 'Fernanda Lima',
    role: 'Gerente',
    company: 'Sabor da Terra Restaurante',
    text: 'Nossa reserva online aumentou 200% após o novo site. O delivery online integrado funcionou perfeitamente desde o primeiro dia. Equipe nota 10!',
    rating: 5,
    initials: 'FL',
  },
];

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
};

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-[#112233] relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[2px] bg-gradient-to-r from-transparent via-[#00C9B1]/30 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[2px] bg-gradient-to-r from-transparent via-[#00C9B1]/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 bg-[#00C9B1]/12 border border-[#00C9B1]/30 rounded-full px-4 py-1.5 text-[11px] text-[#00C9B1] font-bold tracking-[2px] uppercase font-['DM_Sans'] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C9B1] animate-pulse" />
            Depoimentos
          </span>
          <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white mb-5">
            O que nossos clientes
            <br />
            <span className="bg-gradient-to-r from-[#00C9B1] to-[#7EEADC] bg-clip-text text-transparent">
              dizem sobre nós
            </span>
          </h2>
          <p className="font-['DM_Sans'] text-lg text-white/40 max-w-xl mx-auto">
            Mais de 120 empresas transformaram sua presença digital com a Innexar.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-8 hover:border-[#00C9B1]/20 hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <Quote size={24} strokeWidth={1} className="text-[#00C9B1]/30 mb-4" aria-hidden="true" />
              
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={13} className="fill-[#00C9B1] text-[#00C9B1]" aria-hidden="true" />
                ))}
              </div>

              <p className="font-['DM_Sans'] text-sm text-white/60 leading-relaxed flex-1 mb-6">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00C9B1] to-[#0A7EA4] flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-white font-['DM_Sans']">{t.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white font-['DM_Sans']">{t.name}</p>
                  <p className="text-xs text-white/35 font-['DM_Sans']">{t.role} · {t.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
