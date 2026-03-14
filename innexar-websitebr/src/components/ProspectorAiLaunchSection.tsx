'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { Sparkles, ArrowRight } from 'lucide-react';

const PROSPECTOR_AI_YOUTUBE_EMBED = 'https://www.youtube.com/embed/N9pBT12i7nQ?si=iOe5HcG0qRz9fBvm';

export default function ProspectorAiLaunchSection() {
  const t = useTranslations('prospectorAiLaunch');

  return (
    <section className="relative py-16 md:py-24 overflow-hidden bg-slate-950 text-white" aria-labelledby="prospector-ai-launch-title">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.25)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/95 to-slate-950" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/20 border border-violet-400/30 text-violet-300 text-sm font-medium mb-6"
          >
            <Sparkles className="w-4 h-4" aria-hidden />
            {t('badge')}
          </motion.div>
          <motion.h2
            id="prospector-ai-launch-title"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4"
          >
            {t('title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8"
          >
            {t('subtitle')}
          </motion.p>
        </div>

        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-video bg-slate-900">
            <iframe
              src={PROSPECTOR_AI_YOUTUBE_EMBED}
              title={t('videoTitle')}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <p className="mt-4 text-center text-sm text-slate-400">{t('videoCaption')}</p>
        </motion.div>

        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Link
            href="/prospector-ai"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:bg-violet-500 hover:shadow-violet-500/40 hover:scale-[1.02]"
          >
            {t('cta')}
            <ArrowRight className="w-5 h-5" aria-hidden />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
