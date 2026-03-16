'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, AlertCircle, ArrowLeft, Shield, Lock, CheckCircle,
  Rocket, Star, Zap, Mail, User, Phone, FileText, PartyPopper,
  Copy, Check,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { getWorkspaceApiBase, useWorkspaceApi } from '@/lib/workspace-api';

interface ProductSite {
  id: number;
  name: string;
  description: string | null;
  price_plan: { id: number; name: string; amount: number; interval: string; currency: string };
  delivery_hours: number;
  features: string[];
}

const FALLBACK_PLANS: ProductSite[] = [
  {
    id: 1,
    name: 'Site Essencial',
    description: null,
    price_plan: { id: 1, name: 'Mensal', amount: 197, interval: 'month', currency: 'BRL' },
    delivery_hours: 48,
    features: [],
  },
  {
    id: 2,
    name: 'Site Completo',
    description: null,
    price_plan: { id: 2, name: 'Mensal', amount: 297, interval: 'month', currency: 'BRL' },
    delivery_hours: 72,
    features: [],
  },
];

const MP_PUBLIC_KEY = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || '';

const DEFAULT_FEATURES = [
  'Site profissional',
  'Até 5 páginas',
  'Design moderno',
  'WhatsApp integrado',
  'Otimizado para Google',
  'Hospedagem e manutenção',
];

/* ──────────────────────────────────────────────── */
/* Step indicator                                   */
/* ──────────────────────────────────────────────── */
const STEPS = [
  { num: 1, label: 'Seus Dados', icon: User },
  { num: 2, label: 'Pagamento', icon: Lock },
  { num: 3, label: 'Confirmação', icon: CheckCircle },
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-md mx-auto mb-6">
      {STEPS.map((step, i) => {
        const isActive = currentStep === step.num;
        const isDone = currentStep > step.num;
        const Icon = step.icon;
        return (
          <div key={step.num} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`
                  w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${isDone
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                    : isActive
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-400/30 ring-offset-2 ring-offset-slate-950'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }
                `}
              >
                {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <span className={`text-[10px] sm:text-xs font-medium transition-colors ${isActive || isDone ? 'text-white' : 'text-slate-600'}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-10 sm:w-16 h-0.5 mx-1.5 sm:mx-2 mb-5 rounded-full transition-colors duration-300 ${isDone ? 'bg-emerald-500' : 'bg-slate-800'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ──────────────────────────────────────────────── */
/* Main component                                   */
/* ──────────────────────────────────────────────── */
export default function CriarSiteCheckoutPage() {
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isWorkspaceApi = useWorkspaceApi();
  const planSlug = searchParams.get('plano') ?? 'essencial';

  const [plans, setPlans] = useState<ProductSite[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [brickReady, setBrickReady] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);

  // Pix
  const [pixQrCodeBase64, setPixQrCodeBase64] = useState('');
  const [pixQrCode, setPixQrCode] = useState('');
  const [pixCopied, setPixCopied] = useState(false);

  // Contrato de fidelidade 12 meses
  const [fidelityAccepted, setFidelityAccepted] = useState(false);

  // Step control: 1 = Dados, 2 = Pagamento, 3 = Sucesso (paymentSuccess overrides)
  const [step, setStep] = useState(1);

  const brickContainerRef = useRef<HTMLDivElement>(null);
  const brickControllerRef = useRef<{ unmount: () => void } | null>(null);
  const mpInstanceRef = useRef<unknown>(null);

  // Refs para o callback do Brick sempre ler valores atuais (evita closure com state vazio)
  const emailRef = useRef(email);
  const nameRef = useRef(name);
  const phoneRef = useRef(phone);
  const fidelityRef = useRef(fidelityAccepted);
  emailRef.current = email;
  nameRef.current = name;
  phoneRef.current = phone;
  fidelityRef.current = fidelityAccepted;

  const fetchPlans = useCallback(async () => {
    if (!isWorkspaceApi) {
      setPlans(FALLBACK_PLANS);
      setLoadingPlans(false);
      return;
    }
    try {
      const base = getWorkspaceApiBase();
      const res = await fetch(`${base}/api/public/products/sites`);
      if (res.ok) {
        const data = await res.json();
        setPlans(Array.isArray(data) ? data : []);
      } else {
        setPlans(FALLBACK_PLANS);
      }
    } catch {
      setPlans(FALLBACK_PLANS);
    } finally {
      setLoadingPlans(false);
    }
  }, [isWorkspaceApi]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Load Mercado Pago SDK
  useEffect(() => {
    if (!MP_PUBLIC_KEY || sdkLoaded) return;
    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = () => {
      setSdkLoaded(true);
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [sdkLoaded]);

  const selectedPlan =
    planSlug === 'completo'
      ? plans.find((p) => p.name.toLowerCase().includes('completo'))
      : plans.find((p) => p.name.toLowerCase().includes('essencial'));
  const fallbackPlan =
    planSlug === 'completo'
      ? FALLBACK_PLANS.find((p) => p.name.toLowerCase().includes('completo'))
      : FALLBACK_PLANS.find((p) => p.name.toLowerCase().includes('essencial'));
  const displayPlan = selectedPlan ?? plans[0] ?? fallbackPlan ?? FALLBACK_PLANS[0];

  // Initialize Payment Brick (only when step 2 and container is mounted)
  useEffect(() => {
    if (!sdkLoaded || !MP_PUBLIC_KEY || !displayPlan || step !== 2 || !brickContainerRef.current) return;

    const initBrick = async () => {
      try {
        if (brickControllerRef.current) {
          try { brickControllerRef.current.unmount(); } catch { /* ok */ }
          brickControllerRef.current = null;
        }
        if (brickContainerRef.current) {
          brickContainerRef.current.innerHTML = '';
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const MercadoPago = (window as any).MercadoPago;
        if (!MercadoPago) return;

        const mp = new MercadoPago(MP_PUBLIC_KEY, { locale: 'pt-BR' });
        mpInstanceRef.current = mp;
        const bricksBuilder = mp.bricks();

        const controller = await bricksBuilder.create('payment', 'mp-brick-container', {
          locale: 'pt-BR',
          initialization: {
            amount: displayPlan.price_plan.amount,
          },
          customization: {
            visual: {
              style: {
                theme: 'dark',
                customVariables: {
                  formBackgroundColor: 'transparent',
                  baseColor: '#0891b2',
                },
              },
            },
            paymentMethods: {
              bankTransfer: ['pix'],
              ticket: ['bolbradesco'],
              creditCard: 'all',
              debitCard: 'all',
              maxInstallments: 1,
            },
          },
          callbacks: {
             
            onReady: () => {
              setBrickReady(true);
            },
             
            onSubmit: async (param: { formData?: Record<string, unknown>; [key: string]: unknown }) => {
              const data = param.formData ?? param;
              await handleBrickSubmit(data);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (err: any) => {
              console.error('Brick error:', err);
              setError('Erro no formulário de pagamento. Recarregue a página.');
            },
          },
        });

        brickControllerRef.current = controller;
      } catch (err) {
        console.error('Failed to init brick:', err);
        setError('Erro ao carregar formulário de pagamento.');
      }
    };

    initBrick();

    return () => {
      if (brickControllerRef.current) {
        try { brickControllerRef.current.unmount(); } catch { /* ok */ }
        brickControllerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sdkLoaded, displayPlan?.price_plan?.amount, step]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBrickSubmit = async (formData: any) => {
    if (!isWorkspaceApi || !displayPlan) return;

    // MP Brick pode retornar camelCase ou snake_case conforme versão do SDK
    const paymentMethodId = (
      formData.payment_method_id ?? formData.paymentMethodId
    )?.toString().trim();
    if (!paymentMethodId) {
      setError('Selecione um meio de pagamento e preencha os dados antes de continuar.');
      return;
    }

    // Use `||` instead of `??` — MP Brick can return empty string for payer.email
    const currentEmail = (formData.payer?.email || emailRef.current || '').toString().trim().toLowerCase();
    if (!currentEmail) {
      setError('Preencha seu e-mail antes de pagar.');
      return;
    }

    if (!fidelityRef.current) {
      setError('Aceite o contrato de 12 meses de fidelidade para continuar.');
      return;
    }

    setLoading(true);
    setError('');

    const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.innexar.com.br";
    const successUrl = `${portalUrl}/${locale}?checkout=success`;
    const cancelUrl = `${origin}/${locale}/criar-site/checkout?cancel=1`;

    try {
      const base = getWorkspaceApiBase();
      const res = await fetch(`${base}/api/public/checkout/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: displayPlan.id,
          price_plan_id: displayPlan.price_plan.id,
          customer_email: currentEmail,
          customer_name: (nameRef.current ?? '').toString().trim() || undefined,
          customer_phone: (phoneRef.current ?? '').toString().trim() || undefined,
          success_url: successUrl,
          cancel_url: cancelUrl,
          token: formData.token,
          payment_method_id: paymentMethodId,
          issuer_id: (formData.issuer_id ?? formData.issuerId) ? String(formData.issuer_id ?? formData.issuerId) : undefined,
          installments: formData.installments ?? 1,
          payer_email: formData.payer?.email ?? currentEmail,
          fidelity_12_months_accepted: true,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        if (data.payment_status === 'approved') {
          setPaymentSuccess(true);
          setTimeout(() => {
            router.push(`${process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.innexar.com.br"}/${locale}?checkout=success`);
          }, 4000);
          return;
        }
        if (data.payment_url) {
          // Nunca redirecionar para Pro quando enviamos token/payment_method_id (Bricks).
          // Se chegou payment_url, o backend tratou como legacy — não redirecionar para evitar pedir cartão duas vezes.
          setError('Erro inesperado no pagamento. Tente novamente ou entre em contato com o suporte.');
          return;
        }
        if (data.qr_code_base64 && data.qr_code) {
          setPixQrCodeBase64(data.qr_code_base64);
          setPixQrCode(data.qr_code);
          return;
        }
        if (data.error_message) {
          setError(data.error_message);
          return;
        }
        if (data.payment_status === 'pending' || data.payment_status === 'in_process') {
          setError('Pagamento em processamento. Aguarde a confirmação.');
          return;
        }
        setError(data.error_message || 'Pagamento não aprovado. Tente novamente.');
      } else {
        const detail = data.detail;
        const rawMsg =
          typeof detail === 'string'
            ? detail
            : Array.isArray(detail)
              ? (detail[0] as { msg?: string })?.msg ?? 'Erro ao processar pagamento'
              : 'Erro ao processar pagamento. Tente novamente.';
        const msg =
          /Mercado Pago not configured|STRIPE_SECRET_KEY not configured/i.test(rawMsg)
            ? 'Pagamento temporariamente indisponível. Entre em contato com o suporte.'
            : rawMsg;
        setError(msg);
      }
    } catch {
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  /* ─── Pix copy helper ─── */
  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixQrCode);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  };

  /* ─── Step for indicator ─── */
  const currentStep = paymentSuccess ? 3 : pixQrCodeBase64 ? 2 : step;

  /* ─── Unavailable ─── */
  if (!isWorkspaceApi) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <p className="text-slate-400 mb-4">Checkout disponível apenas com a API do workspace configurada.</p>
          <Link href="/criar-site" className="text-cyan-400 hover:underline">
            Voltar para planos
          </Link>
        </div>
      </div>
    );
  }

  /* ─── ✅ Payment Success Screen ─── */
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-[128px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg w-full relative z-10"
        >
          <StepIndicator currentStep={3} />

          {/* Logo */}
          <Link href="/" className="inline-block mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-innexar.svg" alt="Innexar" className="h-12 w-auto mx-auto opacity-90 hover:opacity-100 transition-opacity" />
          </Link>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="mx-auto w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20"
          >
            <PartyPopper className="h-12 w-12 text-emerald-400" />
          </motion.div>

          <h2 className="text-3xl font-bold text-white mb-3">Pagamento aprovado! 🎉</h2>
          <p className="text-slate-400 mb-8 text-lg">Seu site está sendo preparado. Assinatura criada com sucesso.</p>

          {/* Next steps */}
          <div className="rounded-2xl bg-slate-800/60 backdrop-blur border border-white/10 p-6 text-left space-y-4 mb-8">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Próximos passos</h3>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Pagamento confirmado</p>
                <p className="text-slate-500 text-xs">Recibo enviado para seu e-mail</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Mail className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Login e senha enviados por e-mail</p>
                <p className="text-slate-500 text-xs">Verifique sua caixa de entrada (e spam) para acessar o portal</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <FileText className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">Preencher dados do site</p>
                <p className="text-slate-500 text-xs">Conte sobre seu negócio e envie fotos para criarmos o site perfeito</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-cyan-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Redirecionando para o portal...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ─── Pix QR Code Screen ─── */
  if (pixQrCodeBase64) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4 py-12 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <StepIndicator currentStep={2} />

          <div className="rounded-3xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 text-center shadow-2xl">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center mb-4 border border-cyan-500/20">
              <Zap className="h-7 w-7 text-cyan-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Pague com Pix</h2>
            <p className="text-slate-400 mb-6 text-sm">Escaneie o QR Code pelo aplicativo do seu banco.</p>

            <div className="bg-white p-4 rounded-2xl inline-block mb-6 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`data:image/jpeg;base64,${pixQrCodeBase64}`} alt="QR Code Pix" className="w-48 h-48 sm:w-56 sm:h-56 object-contain" />
            </div>

            <p className="text-slate-500 text-xs mb-3">Ou copie o código Pix:</p>
            <div className="flex items-center gap-2 max-w-full">
              <input
                readOnly
                value={pixQrCode}
                className="flex-1 bg-black/30 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-slate-300 outline-none w-full font-mono text-xs"
              />
              <button
                onClick={handleCopyPix}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${pixCopied
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/20'
                  }`}
              >
                {pixCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {pixCopied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>

            <div className="mt-8 bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-4">
              <div className="flex items-center justify-center gap-2 text-cyan-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Aguardando confirmação do pagamento...</span>
              </div>
              <p className="text-slate-500 text-xs mt-2">O pagamento é confirmado automaticamente em alguns segundos.</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ─── Main Checkout Form ─── */
  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] pointer-events-none" />

      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link
            href="/criar-site"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Voltar para os planos</span>
          </Link>
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Lock className="h-3.5 w-3.5" />
            <span>Checkout seguro</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
        {/* Step indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight text-white">
            Finalize seu pedido
          </h1>
          <p className="mt-2 text-slate-400 text-sm sm:text-base">
            Seu site profissional entregue em até {displayPlan?.delivery_hours ?? 48} horas
          </p>
        </div>

        {/* Two-column layout on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">

          {/* LEFT: Summary (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-5 order-2 lg:order-1">
            {/* Plan summary card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 shadow-xl"
            >
              {loadingPlans ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                </div>
              ) : displayPlan ? (
                <>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-bold text-white text-lg">{displayPlan.name}</h2>
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
                      {displayPlan.price_plan.name}
                    </span>
                  </div>
                  <p className="text-cyan-400 text-3xl font-bold">
                    R$ {displayPlan.price_plan.amount.toFixed(0)}
                    <span className="text-slate-400 text-base font-normal"> / mês</span>
                  </p>
                  <p className="text-slate-500 text-sm mt-1">
                    Entrega em até {displayPlan.delivery_hours ?? 48} horas
                  </p>

                  <div className="h-px bg-white/5 my-4" />

                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Inclui:</p>
                  <ul className="space-y-2 text-sm">
                    {(displayPlan.features?.length ? displayPlan.features.slice(0, 6) : DEFAULT_FEATURES).map((f) => (
                      <li key={f} className="flex items-center gap-2 text-slate-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </motion.div>

            {/* Guarantee */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl bg-emerald-500/5 border border-emerald-500/15 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">Garantia de satisfação</p>
                  <p className="text-slate-400 text-xs mt-0.5">Se você não gostar do projeto inicial, ajustamos até ficar perfeito.</p>
                </div>
              </div>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-4 shadow-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-white font-semibold text-sm">4.9</span>
                <div className="flex gap-0.5 ml-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-slate-400 text-sm">+200 empresas atendidas</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {['Google', 'WhatsApp', 'Mercado Pago'].map((badge) => (
                  <span key={badge} className="inline-flex items-center rounded-md bg-slate-800 border border-slate-700/50 px-2 py-1 text-xs text-slate-400">
                    {badge}
                  </span>
                ))}
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 border border-slate-700/50 px-2 py-1 text-xs text-slate-400">
                  <Lock className="h-2.5 w-2.5" /> SSL
                </span>
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Form + Payment (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-5 order-1 lg:order-2">
            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 1: Seus dados + contrato */}
            {step === 1 && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 shadow-xl"
                >
                  <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-400">1</div>
                    Seus dados
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1" htmlFor="checkout-name">Nome</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        <input
                          id="checkout-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 outline-none transition"
                          placeholder="Seu nome"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1" htmlFor="checkout-phone">WhatsApp</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        <input
                          id="checkout-phone"
                          type="text"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 outline-none transition"
                          placeholder="(00) 00000-0000"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs text-slate-500 mb-1" htmlFor="checkout-email">E-mail *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                        <input
                          id="checkout-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-slate-600 focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/30 outline-none transition"
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 shadow-xl"
                >
                  <p className="text-slate-300 text-sm leading-relaxed">
                    Este plano possui compromisso de <strong className="text-white">12 meses</strong>. Em caso de rescisão antecipada, será aplicada multa proporcional ao tempo restante, conforme legislação aplicável (CDC e Resolução Anatel 632/2014).
                  </p>
                  <label className="mt-3 flex items-start gap-3 cursor-pointer group">
                    <input
                      id="checkout-fidelity"
                      type="checkbox"
                      checked={fidelityAccepted}
                      onChange={(e) => setFidelityAccepted(e.target.checked)}
                      className="mt-0.5 h-5 w-5 flex-shrink-0 rounded border-2 border-slate-600 bg-slate-800 text-cyan-500 accent-cyan-500 focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-slate-950"
                    />
                    <span className="text-slate-400 text-sm group-hover:text-white transition-colors">
                      Li e aceito o contrato de 12 meses e as condições de multa por rescisão antecipada.
                    </span>
                  </label>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      const emailTrim = email.trim().toLowerCase();
                      if (!emailTrim) {
                        setError('Preencha seu e-mail.');
                        return;
                      }
                      if (!fidelityAccepted) {
                        setError('Aceite o contrato de 12 meses de fidelidade para continuar.');
                        return;
                      }
                      setError('');
                      setStep(2);
                    }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-base hover:from-cyan-400 hover:to-blue-400 flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
                  >
                    Continuar para pagamento
                    <ArrowLeft className="h-5 w-5 rotate-180" />
                  </button>
                </motion.div>
              </>
            )}

            {/* Step 2: Pagamento */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col gap-3"
              >
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="self-start inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors mb-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </button>
                {MP_PUBLIC_KEY ? (
                <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 shadow-xl">
                  <h2 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-400">2</div>
                    Pagamento
                  </h2>
                  <div className="flex items-center gap-2 text-slate-500 text-xs mb-4">
                    <Lock className="h-3 w-3" />
                    <span>100% seguro via Mercado Pago · Seus dados são criptografados</span>
                  </div>

                  {!brickReady && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-5 h-5 animate-spin text-cyan-400 mr-2" />
                      <span className="text-slate-400 text-sm">Carregando métodos de pagamento...</span>
                    </div>
                  )}
                  <div className={brickReady ? 'min-h-[280px] w-full' : 'h-0 overflow-hidden'}>
                    <div
                      id="mp-brick-container"
                      ref={brickContainerRef}
                      className="w-full h-full min-h-[260px]"
                    />
                  </div>

                  {loading && (
                    <div className="flex items-center justify-center py-3 mt-2 bg-cyan-500/5 rounded-xl border border-cyan-500/10">
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-400 mr-2" />
                      <span className="text-cyan-400 text-sm font-medium">Processando pagamento...</span>
                    </div>
                  )}
                </div>
              ) : (
                /* Fallback: Checkout Pro (no Public Key configured) */
                <div className="rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 shadow-xl">
                  <div className="mb-4 space-y-2">
                    <p className="text-amber-400 font-medium text-sm">
                      Checkout via redirecionamento — o botão Pagar pode ficar desabilitado na página do Mercado Pago.
                    </p>
                    <p className="text-slate-400 text-xs">
                      Configure <code className="bg-slate-800 px-1 rounded">NEXT_PUBLIC_MP_PUBLIC_KEY</code> no .env para usar o formulário de pagamento integrado (Bricks) e evitar esse problema.
                    </p>
                    <p className="text-amber-400/90 text-xs p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                      Em modo de teste: use uma conta de teste do Mercado Pago (Painel &gt; Usuários de teste).
                    </p>
                  </div>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!isWorkspaceApi || !displayPlan) return;
                      const emailTrim = email.trim().toLowerCase();
                      if (!emailTrim) { setError('Preencha seu e-mail.'); return; }
                      if (!fidelityAccepted) {
                        setError('Aceite o contrato de 12 meses de fidelidade para continuar.');
                        return;
                      }
                      setLoading(true);
                      setError('');
                      const portalUrl = process.env.NEXT_PUBLIC_PORTAL_URL || "https://portal.innexar.com.br";
                      const successUrl = `${portalUrl}/${locale}?checkout=success`;
                      const cancelUrl = `${origin}/${locale}/criar-site/checkout?cancel=1`;
                      try {
                        const base = getWorkspaceApiBase();
                        const res = await fetch(`${base}/api/public/checkout/start`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            product_id: displayPlan.id,
                            price_plan_id: displayPlan.price_plan.id,
                            customer_email: emailTrim,
                            customer_name: name.trim() || undefined,
                            customer_phone: phone.trim() || undefined,
                            success_url: successUrl,
                            cancel_url: cancelUrl,
                            fidelity_12_months_accepted: true,
                          }),
                        });
                        const data = await res.json().catch(() => ({}));
                        if (res.ok && data.payment_url) {
                          window.location.href = data.payment_url;
                          return;
                        }
                        const detail = data.detail;
                        const rawDetail = typeof detail === 'string' ? detail : 'Erro ao iniciar checkout. Tente novamente.';
                        const friendlyMsg =
                          /Mercado Pago not configured|STRIPE_SECRET_KEY not configured/i.test(rawDetail)
                            ? 'Pagamento temporariamente indisponível. Entre em contato com o suporte.'
                            : rawDetail;
                        setError(friendlyMsg);
                      } catch {
                        setError('Erro de conexão.');
                      } finally {
                        setLoading(false);
                      }
                    }}
                  >
                    <button
                      type="submit"
                      disabled={loading || !displayPlan || !fidelityAccepted}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold text-base hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Redirecionando...
                        </>
                      ) : (
                        <>
                          <Rocket className="h-5 w-5" />
                          Criar meu site agora
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

                {/* Urgency + Extra info */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-1">
                  {displayPlan && (
                    <p className="text-slate-500 text-xs">
                      Você será cobrado R$ {displayPlan.price_plan.amount.toFixed(0)}/mês
                    </p>
                  )}
                  <p className="flex items-center gap-1.5 text-amber-400/80 text-xs">
                    <Zap className="h-3.5 w-3.5 flex-shrink-0" />
                    Vagas limitadas para entrega em 48h
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
