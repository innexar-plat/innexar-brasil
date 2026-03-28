import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AppLayout } from '@/components/layout/AppLayout'
import { LoadingPage, ChunkErrorBoundary } from '@/components/feedback'
import LoginPage from '@/pages/LoginPage'

const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'))
const AssinaturasPage = lazy(() => import('@/pages/assinaturas/AssinaturasPage'))
const FaturasPage = lazy(() => import('@/pages/faturas/FaturasPage'))
const PagamentosPage = lazy(() => import('@/pages/pagamentos/PagamentosPage'))
const ProdutosPage = lazy(() => import('@/pages/produtos/ProdutosPage'))
const SuportePage = lazy(() => import('@/pages/suporte/SuportePage'))

function SuspensePage({ children }: { children: React.ReactNode }) {
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
          {
            path: 'dashboard',
            element: <SuspensePage><DashboardPage /></SuspensePage>,
          },
          {
            path: 'assinaturas',
            element: <SuspensePage><AssinaturasPage /></SuspensePage>,
          },
          {
            path: 'faturas',
            element: <SuspensePage><FaturasPage /></SuspensePage>,
          },
          {
            path: 'pagamentos',
            element: <SuspensePage><PagamentosPage /></SuspensePage>,
          },
          {
            path: 'produtos',
            element: <SuspensePage><ProdutosPage /></SuspensePage>,
          },
          {
            path: 'suporte',
            element: <SuspensePage><SuportePage /></SuspensePage>,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])
