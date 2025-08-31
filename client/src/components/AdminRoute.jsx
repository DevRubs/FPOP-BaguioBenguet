import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminRoute() {
  const { isAuthenticated, user } = useAuth()
  const isAdmin = user?.role === 'admin'
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}


