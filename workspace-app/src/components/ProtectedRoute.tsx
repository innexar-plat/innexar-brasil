import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { LoadingPage } from '@/components/feedback'

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <LoadingPage />
  if (!user) return <Navigate to="/login" replace />

  return <Outlet />
}
