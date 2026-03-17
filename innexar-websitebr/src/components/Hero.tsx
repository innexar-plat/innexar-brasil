'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Rocket, CalendarDays, Globe, BrainCircuit, Smartphone, ShieldCheck } from 'lucide-react';

function CountUp({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = end / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [started, end, duration]);

  return <span ref={ref}>{count}</span>;
}

const stats = [
  { icon: Globe, value: 120, suffix: '+', label: 'Sites entregues' },
  { icon: Smartphone, value: 8, suffix: '+', label: 'Anos de experiência' },
  { icon: BrainCircuit, value: 98, suffix: '%', label: 'Clientes satisfeitos' },
  { icon: ShieldCheck, value: 24, suffix: '/7', label: 'Suporte ativo' },
];

const features = [
  { icon: Globe, text: 'Sites e Landing Pages' },
  { icon: Smartphone, text: 'Apps Web e Mobile' },
  { icon: BrainCircuit, text: 'Inteligência Artificial' },
  { icon: ShieldCheck, text: 'SEO e Performance' },
];

export default function Hero() {
  const whatsappUrl = `https://wa.me/5513991821557?text=${encodeURIComponent('Olá! Gostaria de agendar uma call com a Innexar.')}`;

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#0D1B2A]">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full bg-[#00C9B1]/[0.07] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#0A7EA4]/[0.08] blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#FF6B47]/[0.04] blur-[100px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: `linear-gradient(rgba(0,201,177,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,201,177,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-6 h-[2px] bg-[#00C9B1]" />
              <span className="text-[11px] text-[#00C9B1] font-bold tracking-[3px] uppercase font-['DM_Sans']">
                Agência Digital Premium
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-['Playfair_Display'] text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.08] mb-6"
            >
              Seu negócio
              <br />
              merece um
              <br />
              <span className="bg-gradient-to-r from-[#00C9B1] via-[#FF9B4E] to-[#FF6B47] bg-clip-text text-transparent">
                site incrível.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="font-['DM_Sans'] text-lg text-white/55 leading-relaxed mb-10 max-w-lg"
            >
              Criamos sites profissionais, apps e soluções com IA que geram resultados reais. Do design à entrega, acompanhamos cada etapa do seu crescimento digital.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link
                href="/criar-site"
                className="flex items-center gap-2 bg-gradient-to-r from-[#00C9B1] to-[#0A7EA4] text-white rounded-full px-8 py-3.5 text-sm font-semibold font-['DM_Sans'] shadow-[0_8px_32px_rgba(0,201,177,0.35)] hover:shadow-[0_14px_40px_rgba(0,201,177,0.5)] hover:-translate-y-0.5 transition-all duration-300"
              >
                <Rocket size={18} strokeWidth={1.5} aria-hidden="true" />
                Criar meu site agora
              </Link>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border border-white/15 text-white/70 rounded-full px-7 py-3.5 text-sm font-medium font-['DM_Sans'] hover:border-[#00C9B1]/50 hover:text-[#00C9B1] hover:bg-[#00C9B1]/5 transition-all duration-200"
              >
                <CalendarDays size={18} strokeWidth={1.5} aria-hidden="true" />
                Agendar uma call
              </a>
            </motion.div>

            {/* Feature tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.07] rounded-full px-3.5 py-1.5">
                  <f.icon size={13} strokeWidth={1.5} className="text-[#00C9B1]" aria-hidden="true" />
                  <span className="text-xs text-white/50 font-['DM_Sans']">{f.text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - Logo / Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md aspect-square">
              {/* Glow rings */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00C9B1]/20 to-[#0A7EA4]/20 blur-3xl" />
              <div className="absolute inset-8 rounded-full border border-[#00C9B1]/15 animate-pulse" />
              <div className="absolute inset-16 rounded-full border border-[#00C9B1]/10" />
              {/* Logo */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src="/logo-innexar.svg"
                  alt="Innexar"
                  width={280}
                  height={280}
                  className="object-contain brightness-0 invert opacity-90"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.1, delayChildren: 0.6 } }
          }}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 md:mt-24"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
              }}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:border-[#00C9B1]/25 hover:bg-[#00C9B1]/[0.04] hover:-translate-y-0.5 transition-all duration-300"
            >
              <stat.icon size={16} strokeWidth={1.5} className="text-[#00C9B1]/60 mb-3" aria-hidden="true" />
              <p className="font-['Playfair_Display'] text-4xl font-black text-[#00C9B1] leading-none mb-1.5">
                <CountUp end={stat.value} />{stat.suffix}
              </p>
              <p className="text-xs text-white/40 font-['DM_Sans'] leading-snug">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}