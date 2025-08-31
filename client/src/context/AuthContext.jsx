import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [initialized, setInitialized] = useState(false)

  // Bootstrap from backend session
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await api.get('/api/auth/me')
        if (!mounted) return
        setUser(res.user || null)
      } catch {
        if (!mounted) return
        setUser(null)
      } finally {
        if (mounted) setInitialized(true)
      }
    })()
    return () => { mounted = false }
  }, [])

  // Persist minimal user locally as a fallback
  useEffect(() => {
    try {
      if (user) localStorage.setItem('pb:user', JSON.stringify(user))
      else localStorage.removeItem('pb:user')
    } catch {}
  }, [user])

  async function loginWithCredentials({ email, password }) {
    const res = await api.post('/api/auth/login', { email, password })
    setUser(res.user)
    return res.user
  }

  async function registerAccount({ name, email, password }) {
    const res = await api.post('/api/auth/register', { name, email, password })
    return res
  }

  async function logout() {
    try { await api.post('/api/auth/logout') } catch {}
    setUser(null)
  }
  const updateUser = (partial) => setUser((prev) => prev ? { ...prev, ...partial } : prev)

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    login: loginWithCredentials,
    register: registerAccount,
    logout,
    updateUser,
    initialized,
  }), [user, initialized])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


