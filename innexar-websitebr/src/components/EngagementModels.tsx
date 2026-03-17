'use client';

import { motion } from 'framer-motion';
import { Users, Zap, Clock, Shield } from 'lucide-react';

const models = [
  {
    icon: Zap,
    title: 'Projeto Fixo',
    desc: 'Escopo definido, prazo e custo fechados. Ideal para projetos com requisitos claros.',
    badge: 'Mais popular',
    badgeColor: 'bg-blue-100 text-blue-700',
    features: ['Escopo fechado', 'Prazo definido', 'Preço fixo', 'Garantia de entrega'],
  },
  {
    icon: Clock,
    title: 'Hora/Mês',
    desc: 'Pacote mensal de horas para projetos contínuos e demandas variáveis.',
    badge: null,
    badgeColor: '',
    features: ['Horas flexíveis', 'Demanda variável', 'Prioridade de atendimento', 'Relatórios mensais'],
  },
  {
    icon: Users,
    title: 'Time Dedicado',
    desc: 'Equipe alocada exclusivamente para seu projeto, como um time interno.',
    badge: 'Empresas',
    badgeColor: 'bg-purple-100 text-purple-700',
    features: ['Equipe exclusiva', 'Full-time', 'Integração total', 'Gestão Innexar'],
  },
  {
    icon: Shield,
    title: 'Suporte & Manutenção',
    desc: 'Manutenção preventiva e corretiva para seus sistemas já existentes.',
    badge: null,
    badgeColor: '',
    features: ['SLA garantido', 'Monitoramento 24/7', 'Atualizações', 'Suporte prioritário'],
  },
];

export default function EngagementModels() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Modelos de Contratação
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Escolha o modelo que melhor se adapta ao seu negócio e orçamento.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {models.map((model, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <model.icon className="h-6 w-6" />
                </div>
                {model.badge && (
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${model.badgeColor}`}>
                    {model.badge}
                  </span>
                )}
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{model.title}</h3>
              <p className="text-sm text-slate-500 mb-4 leading-relaxed">{model.desc}</p>
              <ul className="space-y-1">
                {model.features.map((f, j) => (
                  <li key={j} className="text-xs text-slate-500 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
