import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { authApi } from '@/lib/api'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
  is_active: boolean
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ws_access_token'))
  const [isLoading, setIsLoading] = useState(true)

  const logout = useCallback(() => {
    localStorage.removeItem('ws_access_token')
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return
    }
    authApi
      .me()
      .then(setUser)
      .catch(() => logout())
      .finally(() => setIsLoading(false))
  }, [token, logout])

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login(email, password)
    localStorage.setItem('ws_access_token', data.access_token)
    setToken(data.access_token)
    const me = await authApi.me()
    setUser(me)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
