import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import LoginRequired from './LoginRequired.jsx'

export default function PrivateRoute() {
  const location = useLocation()
  const { isAuthenticated, initialized } = useAuth()
  if (!initialized) return null
  if (!isAuthenticated) {
    // For chat and appointments routes, show only the login-required modal (do not render page content)
    if (location.pathname.startsWith('/chat') || location.pathname.startsWith('/appointments')) {
      return <LoginRequired />
    }
    return <Navigate to="/login" replace />
  }
  return <Outlet />
}


