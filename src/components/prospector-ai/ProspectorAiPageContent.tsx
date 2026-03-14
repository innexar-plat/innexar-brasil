'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Search, Brain, Download, MapPin, Target, Users, BarChart3, Zap } from 'lucide-react';
import { Link } from '@/i18n/navigation';

const PROSPECTOR_AI_YOUTUBE_EMBED = 'https://www.youtube.com/embed/N9pBT12i7nQ?si=iOe5HcG0qRz9fBvm';

const PROSPECTOR_AI_APP_URL =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_PROSPECTOR_AI_URL) ||
  'https://prospectorai.innexar.com.br';
const SIGNUP_PATH = '/auth/signup';
const signupUrl = `${PROSPECTOR_AI_APP_URL.replace(/\/$/, '')}${SIGNUP_PATH}`;

export default function ProspectorAiPageContent() {
  const t = useTranslations('prospectorAi');

  const features = [
    { title: t('feature1Title'), desc: t('feature1Desc'), icon: Search },
    { title: t('feature2Title'), desc: t('feature2Desc'), icon: Brain, highlight: true },
    { title: t('feature3Title'), desc: t('feature3Desc'), icon: Download },
  ];

  const steps = [
    { step: '01', title: t('how1Title'), desc: t('how1Desc') },
    { step: '02', title: t('how2Title'), desc: t('how2Desc') },
    { step: '03', title: t('how3Title'), desc: t('how3Desc') },
  ];

  const newFeatures = [
    { title: t('newFeature1Title'), desc: t('newFeature1Desc'), icon: BarChart3 },
    { title: t('newFeature2Title'), desc: t('newFeature2Desc'), icon: Target },
    { title: t('newFeature3Title'), desc: t('newFeature3Desc'), icon: Zap },
    { title: t('newFeature4Title'), desc: t('newFeature4Desc'), icon: Users },
    { title: t('newFeature5Title'), desc: t('newFeature5Desc'), icon: MapPin },
    { title: t('newFeature6Title'), desc: t('newFeature6Desc'), icon: Target },
  ];

  return (
    <div className="min-h-screen bg-white pt-20 lg:pt-[7.75rem]">
      {/* Hero */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.25)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/95 to-slate-950" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            {t('heroTitle')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-10"
          >
            {t('heroSubtitle')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href={signupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:bg-violet-500 hover:scale-[1.02]"
            >
              {t('ctaSignup')}
              <ExternalLink className="w-5 h-5" aria-hidden />
            </a>
            <a
              href={PROSPECTOR_AI_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 text-lg font-semibold text-white transition-all hover:border-violet-400 hover:bg-white/5"
            >
              {t('ctaPlans')}
              <ArrowRight className="w-5 h-5" aria-hidden />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Video */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50" aria-labelledby="prospector-video-title">
        <div className="max-w-4xl mx-auto">
          <h2 id="prospector-video-title" className="sr-only">
            {t('videoTitle')}
          </h2>
          <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xl aspect-video bg-slate-900">
            <iframe
              src={PROSPECTOR_AI_YOUTUBE_EMBED}
              title={t('videoTitle')}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <p className="mt-4 text-center text-slate-500 text-sm">{t('videoCaption')}</p>
        </div>
      </section>

      {/* What is */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">{t('whatIsTitle')}</h2>
          <p className="text-lg text-slate-600 leading-relaxed">{t('whatIsBody')}</p>
        </div>
      </section>

      {/* Features - 3 cards */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t('featuresTitle')}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">{t('featuresSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className={`p-8 rounded-2xl border shadow-sm transition-all hover:shadow-md ${
                  item.highlight
                    ? 'bg-violet-500/10 border-violet-500/25 md:-translate-y-1'
                    : 'bg-white border-slate-200 hover:border-violet-500/20'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                    item.highlight ? 'bg-violet-600 text-white' : 'bg-violet-500/10 text-violet-600'
                  }`}
                >
                  <item.icon className="w-7 h-7" aria-hidden />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{t('howTitle')}</h2>
            <p className="text-lg text-slate-600">{t('howSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="text-center p-8 rounded-2xl bg-slate-50 border border-slate-200"
              >
                <div className="w-14 h-14 rounded-2xl bg-violet-600 text-white flex items-center justify-center font-bold text-lg mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New features grid */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-bold mb-4">
              <Zap className="w-4 h-4" aria-hidden /> NOVIDADES
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{t('newFeaturesTitle')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {newFeatures.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-violet-500/25 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-violet-500/10 text-violet-600">
                  <item.icon className="w-6 h-6" aria-hidden />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('finalCtaTitle')}</h2>
          <p className="text-xl text-slate-300 mb-10">{t('finalCtaSubtitle')}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={signupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:bg-violet-500 hover:shadow-violet-500/40 hover:scale-[1.02]"
            >
              {t('ctaSignup')}
              <ExternalLink className="w-5 h-5" aria-hidden />
            </a>
            <a
              href={PROSPECTOR_AI_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-10 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
            >
              {t('ctaPlans')}
              <ArrowRight className="w-5 h-5" aria-hidden />
            </a>
          </div>
          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" aria-hidden />
              {t('backToHome')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
