'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useSiteConfig } from '@/contexts/SiteConfigContext';

export default function WhatsAppButton() {
  const { config } = useSiteConfig();
  const number = config.site_whatsapp_br || '5513991821557';
  const url = `https://wa.me/${number}?text=${encodeURIComponent('Olá! Vim pelo site da Innexar e gostaria de saber mais.')}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, duration: 0.4, type: 'spring' }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] bg-[#25D366] hover:bg-[#20BD5A] transition-colors duration-200"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle size={26} strokeWidth={1.5} className="text-white" aria-hidden="true" />
    </motion.a>
  );
}
