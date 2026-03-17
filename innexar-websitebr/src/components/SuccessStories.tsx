'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const successStories = [
  {
    name: 'João Silva',
    company: 'TechStart Brasil',
    role: 'CEO',
    text: 'A Innexar transformou nossa presença digital. Aumentamos as conversões em 120% em apenas 3 meses.',
    avatar: '👨‍💼',
    rating: 5,
  },
  {
    name: 'Maria Santos',
    company: 'Clínica Saúde+',
    role: 'Diretora',
    text: 'O site criado pela equipe Innexar é moderno, rápido e converteu mais pacientes do que imaginávamos.',
    avatar: '👩‍⚕️',
    rating: 5,
  },
  {
    name: 'Pedro Oliveira',
    company: 'Imóveis Prime SP',
    role: 'Fundador',
    text: 'Em 6 meses com a Innexar, triplicamos os leads qualificados. Resultado surpreendente!',
    avatar: '🏢',
    rating: 5,
  },
];

export default function SuccessStories() {
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
            Histórias de Sucesso
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Empresas que confiaram na Innexar e alcançaram resultados extraordinários.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {successStories.map((story, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <Quote className="h-8 w-8 text-blue-200 mb-4" />
              <p className="text-slate-600 mb-6 leading-relaxed">{story.text}</p>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: story.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{story.avatar}</div>
                <div>
                  <div className="font-semibold text-slate-900">{story.name}</div>
                  <div className="text-sm text-slate-500">{story.role} · {story.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
