'use client';

import { motion } from 'framer-motion';
import { Search, FileText, Code, Rocket, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Diagnóstico',
    desc: 'Entendemos seu negócio, objetivos e desafios para criar a estratégia certa.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: FileText,
    title: 'Proposta',
    desc: 'Elaboramos uma proposta personalizada com escopo, prazo e investimento claros.',
    color: 'bg-indigo-100 text-indigo-600',
  },
  {
    icon: Code,
    title: 'Desenvolvimento',
    desc: 'Desenvolvemos com as melhores tecnologias, com atualizações semanais para você.',
    color: 'bg-purple-100 text-purple-600',
  },
  {
    icon: CheckCircle2,
    title: 'Revisão & Aprovação',
    desc: 'Revisamos juntos, ajustamos detalhes e aprovamos cada etapa do projeto.',
    color: 'bg-violet-100 text-violet-600',
  },
  {
    icon: Rocket,
    title: 'Lançamento',
    desc: 'Publicamos seu projeto com suporte contínuo para garantir o sucesso.',
    color: 'bg-pink-100 text-pink-600',
  },
];

export default function ProcessSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Como Trabalhamos
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Um processo transparente e estruturado para garantir o melhor resultado para seu negócio.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="text-center relative"
            >
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl ${step.color} mb-4 relative z-10`}>
                <step.icon className="h-8 w-8" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-slate-900 text-white rounded-full text-xs flex items-center justify-center font-bold z-20">
                {i + 1}
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
