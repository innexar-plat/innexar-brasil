import { PageWrapper, PageHeader } from '@/components/layout'
import { Card, CardHeader } from '@/components/ui'
import { Settings } from 'lucide-react'

export default function SettingsPage() {
  return (
    <PageWrapper>
      <PageHeader
        title="Configurações"
        description="Configurações gerais da plataforma"
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Card>
          <CardHeader
            title="Conta & Equipe"
            description="Gerencie usuários, permissões e dados da empresa"
          />
          <div className="flex items-center justify-center py-12 text-slate-600">
            <Settings className="size-12" />
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Integrações"
            description="APIs, webhooks e integrações externas"
          />
          <div className="flex items-center justify-center py-12 text-slate-600">
            <Settings className="size-12" />
          </div>
        </Card>
      </div>
    </PageWrapper>
  )
}
