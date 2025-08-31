import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function AdminRoute() {
  const { isAuthenticated, user } = useAuth()
  const isAllowed = user?.role !== 'user'
  if (!isAuthenticated || !isAllowed) {
    return <Navigate to="/" replace />
  }
  return <Outlet />
}


