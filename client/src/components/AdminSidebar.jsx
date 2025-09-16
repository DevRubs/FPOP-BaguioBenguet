import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const adminNavItems = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/chatbot', label: 'Chatbot' },
  { to: '/admin/support-chat', label: 'Support Chat' },
  { to: '/admin/appointments', label: 'Appointments' },
  { to: '/admin/volunteers', label: 'Volunteers' },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/resources', label: 'Resources' },
  { to: '/admin/notifications', label: 'Notifications' },
]

// true => allowed, false => denied
const TAB_PERMISSIONS = {
  Dashboard: { admin: true, co_admin: true, staff: true, doctor: true, volunteer: true, user: false },
  Users: { admin: true, co_admin: false, staff: false, doctor: false, volunteer: false, user: false },
  Resources: { admin: true, co_admin: true, staff: true, doctor: true, volunteer: true, user: false },
  Chat: { admin: true, co_admin: true, staff: true, doctor: true, volunteer: true, user: false },
  Schedule: { admin: true, co_admin: true, staff: true, doctor: true, volunteer: true, user: false },
  Volunteer: { admin: true, co_admin: true, staff: false, doctor: false, volunteer: false, user: false },
  About: { admin: true, co_admin: true, staff: false, doctor: false, volunteer: false, user: false },
  Youth: { admin: true, co_admin: true, staff: false, doctor: false, volunteer: false, user: false },
}

// Map each sidebar item to a permission tab
const ITEM_TO_TAB = {
  'Dashboard': 'Dashboard',
  'Users': 'Users',
  'Chatbot': 'Chat',
  'Support Chat': 'Chat',
  'Appointments': 'Schedule',
  'Volunteers': 'Volunteer',
  'Events': 'Dashboard',
  'Resources': 'Resources',
  'Notifications': 'Dashboard',
}

function canRoleAccessTab(role, tab) {
  const tabPerm = TAB_PERMISSIONS[tab]
  if (!tabPerm) return false
  return Boolean(tabPerm[role])
}

export default function AdminSidebar({ onNavigate }) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
    if (onNavigate) onNavigate()
  }

  return (
    <nav className="h-full w-full p-3 md:p-4 flex min-h-0 flex-col overflow-hidden bg-white text-slate-900">
      <ul className="space-y-1 flex-1 overflow-y-auto pr-1">
        {adminNavItems.filter((item) => canRoleAccessTab(user?.role || 'user', ITEM_TO_TAB[item.label])).map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) => (
                `block rounded px-3 py-2 text-sm ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`
              )}
              end
              onClick={() => { if (onNavigate) onNavigate() }}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="mt-auto shrink-0 border-t border-slate-200 pt-3">
        <Link
          to="/"
          className="block rounded px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          onClick={() => { if (onNavigate) onNavigate() }}
        >
          Home
        </Link>
        <button
          onClick={handleLogout}
          className="mt-2 w-full rounded border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-700 hover:bg-slate-200"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}


