import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import ProtectedRoute from '@/components/ProtectedRoute'
import AppLayout from '@/components/layout/AppLayout'
import { LoadingPage, ChunkErrorBoundary } from '@/components/feedback'
import LoginPage from '@/pages/LoginPage'

const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'))
const CrmPage = lazy(() => import('@/pages/crm/CrmPage'))
const LeadsPage = lazy(() => import('@/pages/leads/LeadsPage'))
const ContactsPage = lazy(() => import('@/pages/contacts/ContactsPage'))
const ClientesPage = lazy(() => import('@/pages/clients/ClientesPage'))
const CampanhasPage = lazy(() => import('@/pages/campaigns/CampanhasPage'))
const InboxPage = lazy(() => import('@/pages/inbox/InboxPage'))
const CanaisPage = lazy(() => import('@/pages/channels/CanaisPage'))
const TemplatesPage = lazy(() => import('@/pages/templates/TemplatesPage'))
const AgentesPage = lazy(() => import('@/pages/agents/AgentesPage'))
const AnalyticsPage = lazy(() => import('@/pages/analytics/AnalyticsPage'))
const TicketsPage = lazy(() => import('@/pages/tickets/TicketsPage'))
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'))

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <ChunkErrorBoundary>
      <Suspense fallback={<LoadingPage />}>{children}</Suspense>
    </ChunkErrorBoundary>
  )
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <Wrap><DashboardPage /></Wrap> },
          { path: 'crm', element: <Wrap><CrmPage /></Wrap> },
          { path: 'leads', element: <Wrap><LeadsPage /></Wrap> },
          { path: 'contatos', element: <Wrap><ContactsPage /></Wrap> },
          { path: 'clientes', element: <Wrap><ClientesPage /></Wrap> },
          { path: 'campanhas', element: <Wrap><CampanhasPage /></Wrap> },
          { path: 'inbox', element: <Wrap><InboxPage /></Wrap> },
          { path: 'canais', element: <Wrap><CanaisPage /></Wrap> },
          { path: 'templates', element: <Wrap><TemplatesPage /></Wrap> },
          { path: 'agentes', element: <Wrap><AgentesPage /></Wrap> },
          { path: 'analytics', element: <Wrap><AnalyticsPage /></Wrap> },
          { path: 'tickets', element: <Wrap><TicketsPage /></Wrap> },
          { path: 'settings', element: <Wrap><SettingsPage /></Wrap> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])
