'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { Check, MessageCircle } from 'lucide-react';
import { useSiteConfig } from '@/contexts/SiteConfigContext';

const WHATSAPP_FALLBACK = '5513991821557';
const WHATSAPP_SITE_MSG = 'Olá! Gostaria de criar meu site profissional.';

export default function CriarSiteContent() {
  const t = useTranslations('criarSite');
  const { config } = useSiteConfig();
  const whatsappNumber = config.site_whatsapp_br?.replace(/\D/g, '') || config.site_phone_br?.replace(/\D/g, '') || WHATSAPP_FALLBACK;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(WHATSAPP_SITE_MSG)}`;

  const benefits = (t.raw('hero.benefits') as string[]) ?? [];
  const forWhoItems = (t.raw('forWho.items') as string[]) ?? [];
  const includedItems = (t.raw('included.items') as string[]) ?? [];
  const processSteps = (t.raw('process.steps') as { title: string; desc: string }[]) ?? [];
  const demos = (t.raw('examples.demos') as string[]) ?? [];
  const essentialFeatures = (t.raw('plans.essential.features') as string[]) ?? [];
  const completeFeatures = (t.raw('plans.complete.features') as string[]) ?? [];

  return (
    <>
      {/* Price strip */}
      <div className="bg-cyan-500/20 border-b border-cyan-400/30 py-2 text-center">
        <p className="text-sm font-medium text-cyan-200">{t('hero.priceStrip')}</p>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1e40af,transparent_55%)] opacity-40" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#06b6d4,transparent_45%)] opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-cyan-200 backdrop-blur border border-white/10"
          >
            {t('hero.badge')}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 text-4xl md:text-5xl lg:text-5xl font-bold leading-tight text-white"
          >
            {t('hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-slate-200 max-w-2xl"
          >
            {t('hero.subtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/criar-site/checkout"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-4 text-lg font-semibold text-slate-950 shadow-lg transition-all hover:scale-[1.02]"
            >
              {t('hero.ctaCreate')}
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-8 py-4 text-lg font-semibold text-white hover:border-cyan-400/60 hover:bg-white/5 transition-all"
            >
              <MessageCircle className="h-5 w-5" />
              {t('hero.ctaWhatsApp')}
            </a>
          </motion.div>
          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap gap-4 text-slate-300"
          >
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-2">
                <Check className="h-5 w-5 text-emerald-400 shrink-0" />
                <span>{b}</span>
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      {/* Para quem é */}
      <section className="py-16 lg:py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-10">{t('forWho.title')}</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {forWhoItems.map((item) => (
              <li key={item} className="flex items-center gap-3 rounded-xl bg-white/5 border border-white/10 px-5 py-4">
                <Check className="h-5 w-5 text-cyan-400 shrink-0" />
                <span className="text-slate-200">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Planos */}
      <section className="py-16 lg:py-24 bg-white/[0.02] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">{t('plans.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Essencial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6 flex flex-col"
            >
              <h3 className="text-xl font-bold text-white">{t('plans.essential.name')}</h3>
              <p className="mt-2 text-3xl font-bold text-cyan-400">
                R$ {t('plans.essential.price')}
                <span className="text-lg font-normal text-slate-400">{t('plans.essential.period')}</span>
              </p>
              <p className="text-slate-400 text-sm mt-1">{t('plans.essential.delivery')}</p>
              <ul className="mt-6 space-y-2 flex-1">
                {essentialFeatures.map((f) => (
                  <li key={f} className="flex gap-2 text-slate-300 text-sm">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/criar-site/checkout?plano=essencial"
                className="mt-6 w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-center hover:bg-cyan-400 transition-colors"
              >
                {t('plans.essential.cta')}
              </Link>
            </motion.div>

            {/* Completo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-cyan-500/10 border-2 border-cyan-400/40 backdrop-blur p-6 flex flex-col relative"
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-xs font-semibold">
                Popular
              </span>
              <h3 className="text-xl font-bold text-white">{t('plans.complete.name')}</h3>
              <p className="mt-2 text-3xl font-bold text-cyan-400">
                R$ {t('plans.complete.price')}
                <span className="text-lg font-normal text-slate-400">{t('plans.complete.period')}</span>
              </p>
              <p className="text-slate-400 text-sm mt-1">{t('plans.complete.delivery')}</p>
              <ul className="mt-6 space-y-2 flex-1">
                {completeFeatures.map((f) => (
                  <li key={f} className="flex gap-2 text-slate-300 text-sm">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/criar-site/checkout?plano=completo"
                className="mt-6 w-full py-3 rounded-xl bg-cyan-500 text-slate-950 font-semibold text-center hover:bg-cyan-400 transition-colors"
              >
                {t('plans.complete.cta')}
              </Link>
            </motion.div>

            {/* Personalizado */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur p-6 flex flex-col"
            >
              <h3 className="text-xl font-bold text-white">{t('plans.custom.name')}</h3>
              <p className="mt-2 text-slate-400">{t('plans.custom.description')}</p>
              <div className="flex-1" />
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full py-3 rounded-xl border-2 border-cyan-400/60 text-cyan-400 font-semibold text-center hover:bg-cyan-400/10 transition-colors inline-flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                {t('plans.custom.cta')}
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* O que está incluído */}
      <section className="py-16 lg:py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-10">{t('included.title')}</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {includedItems.map((item) => (
              <li key={item} className="flex items-center gap-3 text-slate-200">
                <Check className="h-5 w-5 text-emerald-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Processo */}
      <section className="py-16 lg:py-24 bg-white/[0.02] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-12">{t('process.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {processSteps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center mx-auto mb-4">
                  {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-slate-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exemplos */}
      <section className="py-16 lg:py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-10">{t('examples.title')}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {demos.map((label) => (
              <div
                key={label}
                className="rounded-xl bg-white/5 border border-white/10 px-6 py-4 text-slate-300"
              >
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16 lg:py-24 bg-white/[0.02] border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">{t('testimonials.title')}</h2>
          <blockquote className="text-xl text-slate-200 italic">&ldquo;{t('testimonials.quote')}&rdquo;</blockquote>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-10">{t('faq.title')}</h2>
          <dl className="space-y-6">
            <div>
              <dt className="text-lg font-semibold text-white">{t('faq.q1')}</dt>
              <dd className="mt-2 text-slate-400">{t('faq.a1')}</dd>
            </div>
            <div>
              <dt className="text-lg font-semibold text-white">{t('faq.q2')}</dt>
              <dd className="mt-2 text-slate-400">{t('faq.a2')}</dd>
            </div>
            <div>
              <dt className="text-lg font-semibold text-white">{t('faq.q3')}</dt>
              <dd className="mt-2 text-slate-400">{t('faq.a3')}</dd>
            </div>
            <div>
              <dt className="text-lg font-semibold text-white">{t('faq.q4')}</dt>
              <dd className="mt-2 text-slate-400">{t('faq.a4')}</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 lg:py-28 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white">{t('ctaFinal.title')}</h2>
          <p className="mt-4 text-xl text-slate-300">{t('ctaFinal.subtitle')}</p>
          <Link
            href="/criar-site/checkout"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-10 py-4 text-lg font-semibold text-slate-950 shadow-lg transition-all hover:scale-[1.02]"
          >
            {t('ctaFinal.cta')}
          </Link>
        </div>
      </section>
    </>
  );
}
