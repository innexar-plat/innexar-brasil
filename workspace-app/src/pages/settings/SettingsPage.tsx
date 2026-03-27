import { useState } from 'react'
import { PageWrapper, PageHeader } from '@/components/layout'
import { Card, CardHeader, Button, Input, Switch, Select } from '@/components/ui'
import { User, Bell, Key, Palette, Shield, Globe } from 'lucide-react'

const TIMEZONE_OPTIONS = [
  { value: 'America/Sao_Paulo', label: 'São Paulo (UTC-3)' },
  { value: 'America/Fortaleza', label: 'Fortaleza (UTC-3)' },
  { value: 'America/Manaus', label: 'Manaus (UTC-4)' },
  { value: 'America/Belem', label: 'Belém (UTC-3)' },
  { value: 'UTC', label: 'UTC' },
]

const LANGUAGE_OPTIONS = [
  { value: 'pt_BR', label: 'Português (Brasil)' },
  { value: 'en_US', label: 'English (US)' },
  { value: 'es_ES', label: 'Español' },
]

export default function SettingsPage() {
  const [name, setName] = useState('Admin Innexar')
  const [email] = useState('admin@innexar.com')
  const [timezone, setTimezone] = useState('America/Sao_Paulo')
  const [language, setLanguage] = useState('pt_BR')

  const [notifEmail, setNotifEmail] = useState(true)
  const [notifPush, setNotifPush] = useState(false)
  const [notifTickets, setNotifTickets] = useState(true)
  const [notifCampaigns, setNotifCampaigns] = useState(true)
  const [notifLeads, setNotifLeads] = useState(false)

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise(r => setTimeout(r, 800))
    setIsSaving(false)
  }

  return (
    <PageWrapper>
      <PageHeader
        title="Configurações"
        description="Preferências gerais da plataforma"
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">

          {/* Profile */}
          <Card>
            <CardHeader
              title="Perfil"
              description="Informações da sua conta"
              action={<User className="size-4 text-slate-500" />}
            />
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-brand-600/20 text-brand-400 text-2xl font-bold select-none">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-slate-200">{name}</p>
                  <p className="text-sm text-slate-500">{email}</p>
                  <button className="mt-1 text-xs text-brand-400 hover:text-brand-300 transition">Alterar foto</button>
                </div>
              </div>
              <Input
                label="Nome completo"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Seu nome"
              />
              <Input
                label="E-mail"
                value={email}
                disabled
                placeholder="email@empresa.com"
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Fuso Horário"
                  options={TIMEZONE_OPTIONS}
                  value={timezone}
                  onChange={e => setTimezone(e.target.value)}
                />
                <Select
                  label="Idioma"
                  options={LANGUAGE_OPTIONS}
                  value={language}
                  onChange={e => setLanguage(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button variant="primary" size="sm" isLoading={isSaving} onClick={handleSave}>Salvar alterações</Button>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader
              title="Notificações"
              description="Controle quais alertas deseja receber"
              action={<Bell className="size-4 text-slate-500" />}
            />
            <div className="space-y-3 pt-2">
              {[
                { label: 'E-mail de notificações', desc: 'Receba alertas por e-mail', value: notifEmail, onChange: setNotifEmail },
                { label: 'Notificações Push', desc: 'Alertas no navegador', value: notifPush, onChange: setNotifPush },
                { label: 'Novos Tickets', desc: 'Quando um ticket é aberto', value: notifTickets, onChange: setNotifTickets },
                { label: 'Campanhas', desc: 'Status de campanhas ativas', value: notifCampaigns, onChange: setNotifCampaigns },
                { label: 'Novos Leads', desc: 'Lead captado via integração', value: notifLeads, onChange: setNotifLeads },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/3 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                  <Switch checked={item.value} onChange={e => item.onChange((e.target as HTMLInputElement).checked)} />
                </div>
              ))}
            </div>
          </Card>

          {/* Security */}
          <Card>
            <CardHeader
              title="Segurança"
              description="Senha e autenticação de dois fatores"
              action={<Shield className="size-4 text-slate-500" />}
            />
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/3 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-200">Senha</p>
                  <p className="text-xs text-slate-500">Atualizada há 30 dias</p>
                </div>
                <Button variant="secondary" size="sm">Alterar Senha</Button>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/3 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-200">Autenticação de 2 Fatores</p>
                  <p className="text-xs text-slate-500">Não configurado</p>
                </div>
                <Button variant="outline" size="sm">Ativar 2FA</Button>
              </div>
            </div>
          </Card>

        </div>

        {/* Right sidebar */}
        <div className="space-y-5">

          {/* API Keys */}
          <Card>
            <CardHeader
              title="Chaves de API"
              description="Acesso programático"
              action={<Key className="size-4 text-slate-500" />}
            />
            <div className="space-y-3 pt-2">
              <div className="rounded-xl border border-white/5 bg-white/3 px-4 py-3">
                <p className="text-xs text-slate-500 mb-1">API KEY</p>
                <p className="font-mono text-xs text-slate-300 break-all">inx_sk_***...***a1b2</p>
              </div>
              <Button variant="secondary" size="sm" fullWidth leftIcon={<Key className="size-3.5" />}>
                Gerar Nova Chave
              </Button>
              <p className="text-xs text-slate-500">
                Use a API key no header <code className="text-brand-400">X-API-Key</code> para acessar a API.
              </p>
            </div>
          </Card>

          {/* Integrations */}
          <Card>
            <CardHeader
              title="Integrações"
              description="Serviços externos"
              action={<Globe className="size-4 text-slate-500" />}
            />
            <div className="space-y-2 pt-2">
              {[
                { name: 'OpenAI', status: 'Conectado', ok: true },
                { name: 'WhatsApp Business', status: 'Ativo', ok: true },
                { name: 'Stripe', status: 'Não configurado', ok: false },
                { name: 'Mailgun', status: 'Não configurado', ok: false },
              ].map((integ) => (
                <div key={integ.name} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/3 px-3 py-2.5">
                  <p className="text-sm text-slate-300">{integ.name}</p>
                  <span className={`text-xs font-medium ${integ.ok ? 'text-green-400' : 'text-slate-500'}`}>
                    {integ.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Theme */}
          <Card>
            <CardHeader
              title="Tema"
              description="Preferência visual"
              action={<Palette className="size-4 text-slate-500" />}
            />
            <div className="pt-2 space-y-2">
              {['Escuro (Padrão)', 'Claro', 'Sistemático'].map((t, i) => (
                <button
                  key={t}
                  className={`w-full flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm text-left transition ${
                    i === 0 ? 'border-brand-500/50 bg-brand-500/8 text-brand-300' : 'border-white/5 bg-white/3 text-slate-400 hover:border-white/12 hover:text-slate-200'
                  }`}
                >
                  <span className={`size-3 rounded-full border-2 ${i === 0 ? 'border-brand-400 bg-brand-400' : 'border-slate-600'}`} />
                  {t}
                </button>
              ))}
            </div>
          </Card>

        </div>
      </div>
    </PageWrapper>
  )
}
