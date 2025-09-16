import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import NotFound from '../pages/notFound/NotFound.jsx'

export default function AdminRoute() {
  const { isAuthenticated, user } = useAuth()
  const isAllowed = user?.role !== 'user'
  if (!isAuthenticated || !isAllowed) {
    return <NotFound />
  }
  return <Outlet />
}


