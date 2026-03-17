'use client';

import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

type ServicePageHeroProps = {
  title: string;
  subtitle: string;
  ctaLabel: string;
};

export default function ServicePageHero({ title, subtitle, ctaLabel }: ServicePageHeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 min-h-[60vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, duration: 0.5 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            {subtitle}
          </p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-slate-100 transition-colors shadow-lg"
            >
              {ctaLabel}
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
