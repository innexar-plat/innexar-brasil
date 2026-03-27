import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ApiClientError } from '@/lib/api'
import { Button, Input } from '@/components/ui'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      if (err instanceof ApiClientError && err.statusCode === 401) {
        setError('E-mail ou senha incorretos.')
      } else {
        setError(err instanceof ApiClientError ? err.message : 'Erro ao conectar. Tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #1e1b4b 0%, #07070e 60%)' }}
    >
      {/* Background glow blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -left-48 -top-48 size-[600px] rounded-full opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(circle, #4f46e5 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-48 -right-48 size-[600px] rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
        />
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[400px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #818cf8 0%, transparent 70%)' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md px-5"
      >
        <div className="glass-strong rounded-3xl p-8">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="mb-8 text-center"
          >
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-brand-600/20">
              <div className="size-7 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600" />
            </div>
            <h1 className="text-2xl font-bold text-white">Portal do Cliente</h1>
            <p className="mt-1 text-sm text-slate-400">Innexar — Acesse sua conta</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 }}>
              <Input
                label="E-mail"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                leftIcon={<Mail className="size-4" />}
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Input
                label="Senha"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                leftIcon={<Lock className="size-4" />}
              />
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
              >
                <AlertCircle className="size-4 shrink-0" />
                {error}
              </motion.div>
            )}

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.38 }}>
              <Button fullWidth isLoading={isLoading} size="lg" type="submit" className="mt-2">
                Entrar
              </Button>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

