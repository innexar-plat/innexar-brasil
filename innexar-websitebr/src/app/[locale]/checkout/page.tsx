'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, CreditCard } from 'lucide-react';
import { getWorkspaceApiBase, useWorkspaceApi } from '@/lib/workspace-api';

export default function CheckoutPage() {
  const locale = useLocale();
  const isWorkspaceApi = useWorkspaceApi();
  const [productId, setProductId] = useState('');
  const [pricePlanId, setPricePlanId] = useState('');
  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isWorkspaceApi) {
      setError('Checkout so disponivel com workspace API configurado.');
      return;
    }
    const pid = parseInt(productId, 10);
    const ppid = parseInt(pricePlanId, 10);
    if (Number.isNaN(pid) || Number.isNaN(ppid) || !email.trim()) {
      setError('Preencha produto, plano e email.');
      return;
    }
    setLoading(true);
    setError('');
    const base = getWorkspaceApiBase();
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.innexar.com.br";
    const successUrl = `${portalUrl}/${locale}?checkout=success`;
    const cancelUrl = `${origin}/${locale}/checkout?cancel=1`;
    try {
      const res = await fetch(`${base}/api/public/checkout/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: pid,
          price_plan_id: ppid,
          customer_email: email.trim(),
          success_url: successUrl,
          cancel_url: cancelUrl,
          domain: domain.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.payment_url) {
        window.location.href = data.payment_url;
        return;
      }
      setError(typeof data.detail === 'string' ? data.detail : 'Erro ao iniciar checkout');
    } catch {
      setError('Erro de conexao');
    } finally {
      setLoading(false);
    }
  };

  if (!isWorkspaceApi) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <p className="text-slate-400">Checkout nao configurado. Ative NEXT_PUBLIC_USE_WORKSPACE_API.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <CreditCard className="w-8 h-8 text-blue-400" />
          <h1 className="text-xl font-bold text-white">Checkout</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div>
            <label className="block text-sm text-slate-400 mb-1">Product ID</label>
            <input
              type="number"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Price Plan ID</label>
            <input
              type="number"
              value={pricePlanId}
              onChange={(e) => setPricePlanId(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Dominio (obrigatorio para hospedagem)</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="ex: meusite.com.br"
              className="w-full px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            Ir para pagamento
          </button>
        </form>
      </motion.div>
    </div>
  );
}
