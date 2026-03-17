'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Lightbulb, Target, Users, Rocket, Code2, Shield } from 'lucide-react';

const values = [
  {
    icon: Lightbulb,
    title: 'Inovação',
    desc: 'Usamos as tecnologias mais modernas para criar soluções que fazem a diferença.',
  },
  {
    icon: Target,
    title: 'Foco em Resultados',
    desc: 'Cada decisão é orientada para gerar valor real ao negócio do cliente.',
  },
  {
    icon: Users,
    title: 'Parceria',
    desc: 'Tratamos cada cliente como um parceiro de longo prazo, não apenas um contrato.',
  },
  {
    icon: Shield,
    title: 'Confiabilidade',
    desc: 'Entregamos o que prometemos, com qualidade e dentro do prazo.',
  },
  {
    icon: Code2,
    title: 'Excelência Técnica',
    desc: 'Código limpo, arquitetura sólida e boas práticas em tudo que desenvolvemos.',
  },
  {
    icon: Rocket,
    title: 'Agilidade',
    desc: 'Metodologias ágeis para entregar valor incremental desde o primeiro dia.',
  },
];

const team = [
  { name: 'Equipe de Desenvolvimento', role: 'Full Stack Engineers', emoji: '👨‍💻' },
  { name: 'Design & UX', role: 'Designers Criativos', emoji: '🎨' },
  { name: 'Marketing Digital', role: 'Growth & SEO', emoji: '📈' },
  { name: 'Infraestrutura', role: 'DevOps & Cloud', emoji: '☁️' },
];

export default function AboutContent() {
  const t = useTranslations('about');

  return (
    <div>
      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-slate-900 mb-6">
                {t('mission.title') || 'Nossa Missão'}
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">
                {t('mission.description') || 'Democratizar o acesso à tecnologia de ponta para pequenas e médias empresas brasileiras, entregando soluções digitais que geram crescimento real e sustentável.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {t('values.title') || 'Nossos Valores'}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 text-blue-600 mb-4">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{value.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              {t('team.title') || 'Nossa Equipe'}
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {t('team.description') || 'Profissionais apaixonados por tecnologia e comprometidos com o sucesso dos nossos clientes.'}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100"
              >
                <div className="text-5xl mb-3">{member.emoji}</div>
                <h3 className="font-semibold text-slate-900 mb-1">{member.name}</h3>
                <p className="text-sm text-slate-500">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
