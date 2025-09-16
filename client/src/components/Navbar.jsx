import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useEffect, useRef, useState } from 'react'
import { FiMenu, FiX, FiUser as FiUserIcon, FiCalendar as FiCalendarIcon, FiShield as FiShieldIcon, FiLogOut } from 'react-icons/fi'
import FPOPLogo from '../assets/FPOP.png'
import NotificationBell from './NotificationBell.jsx'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const panelRef = useRef(null)
  const previouslyFocusedRef = useRef(null)

  // Keyboard + focus handling for mobile sheet
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') setMobileOpen(false)
      if (e.key === 'Tab' && mobileOpen && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    if (mobileOpen) {
      previouslyFocusedRef.current = document.activeElement
      const first = panelRef.current?.querySelector('a[href], button, [tabindex]:not([tabindex="-1"])')
      if (first) first.focus()
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKeyDown)
    } else {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
      const prev = previouslyFocusedRef.current
      if (prev && prev.focus) prev.focus()
    }

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

  const navLinkClass = ({ isActive }) => (
    `inline-flex items-center rounded-md px-3 py-2 text-base font-semibold transition-colors ${
      isActive
        ? 'bg-[#3B82F6] text-white'
        : 'text-white/90 hover:bg-[#3B82F6] hover:text-white active:bg-[#2F74ED]'
    }`
  )

  return (
    <header className="sticky top-0 z-50 w-full bg-[#65A3FA] font-friendly shadow-sm">
      <div className="mx-auto max-w-7xl px-4 md:px-6 h-14 md:h-16 flex items-center justify-between gap-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-2 md:gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={FPOPLogo} alt="FPOP Baguio-Benguet Chapter logo" className="h-8 w-auto md:h-10" loading="eager" decoding="async" />
            <span className="hidden sm:inline text-base md:text-lg font-bold text-white whitespace-nowrap">Baguio-Benguet Chapter</span>
          </Link>
        </div>

        {/* Center: Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" className={navLinkClass} end>Home</NavLink>
          <NavLink to="/resources" className={navLinkClass}>Resources</NavLink>
          <NavLink to="/chat" className={navLinkClass}>Chat</NavLink>
          <NavLink to="/appointments/new" className={navLinkClass}>Schedule</NavLink>
          <NavLink to="/volunteer" className={navLinkClass}>Volunteer</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <NavLink
            to="/youth-archive"
            className={({ isActive }) => (
              `hidden sm:inline rounded-md px-3 py-2 text-base font-semibold ${
                isActive
                  ? 'bg-[#3B82F6] text-white'
                  : 'text-white/90 hover:bg-[#3B82F6] hover:text-white active:bg-[#2F74ED]'
              }`
            )}
          >
            Youth Archive
          </NavLink>
          {isAuthenticated && <NotificationBell initialCount={3} />}
          <div className="hidden sm:block">
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/login" className="rounded-md px-3 py-2 text-base font-semibold bg-[#65A3FA] border border-[#65A3FA] hover:bg-[#3B82F6] text-white">Login</Link>
                <Link to="/register" className="rounded-md px-3 py-2 text-base font-semibold bg-white text-[#65A3FA] hover:bg-blue-50">Sign up</Link>
              </div>
            ) : (
              <UserMenu user={user} onLogout={() => { logout(); navigate('/', { replace: true }) }} />
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex md:hidden h-10 w-10 items-center justify-center rounded-md border border-[#65A3FA] bg-[#65A3FA] text-white hover:bg-[#3B82F6]"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <FiMenu size={18} />
          </button>
        </div>
      </div>

      {/* Mobile overlay with smooth animation */}
      <div className={`fixed inset-0 z-50 md:hidden ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!mobileOpen}>
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ease-out ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setMobileOpen(false)}
        />
        <div
          ref={panelRef}
          className={`absolute right-0 top-0 h-full w-72 max-w-[80vw] border-l border-[#65A3FA] bg-[#65A3FA] p-4 shadow-xl outline-none transition-transform duration-200 ease-out ${mobileOpen ? 'translate-x-0' : 'translate-x-full'} font-friendly`}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#65A3FA]/80">
            <span className="text-base font-semibold text-white">Menu</span>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/30 bg-white/10 text-white hover:bg-white/20"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            >
              <FiX size={18} />
            </button>
          </div>

          <div className="mt-3 flex flex-col gap-1">
            <MobileNavLink to="/" onNavigate={() => setMobileOpen(false)} end>Home</MobileNavLink>
            <MobileNavLink to="/resources" onNavigate={() => setMobileOpen(false)}>Resources</MobileNavLink>
            <MobileNavLink to="/chat" onNavigate={() => setMobileOpen(false)}>Chat</MobileNavLink>
            <MobileNavLink to="/appointments/new" onNavigate={() => setMobileOpen(false)}>Schedule</MobileNavLink>
            <MobileNavLink to="/volunteer" onNavigate={() => setMobileOpen(false)}>Volunteer</MobileNavLink>
            <MobileNavLink to="/about" onNavigate={() => setMobileOpen(false)}>About</MobileNavLink>
            <MobileNavLink to="/youth-archive" onNavigate={() => setMobileOpen(false)}>Youth Archive</MobileNavLink>
          </div>

          <div className="mt-4 border-t border-white/30 pt-3 font-friendly">
            {!isAuthenticated ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/login"
                  className="rounded-md px-3 py-2 text-base font-semibold bg-white text-[#65A3FA] hover:bg-white/90"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-md px-3 py-2 text-base font-semibold bg-white text-[#65A3FA] hover:bg-blue-50"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-1 text-base font-semibold">
                <Link to="/dashboard" className="rounded-md px-3 py-2 text-white/90 hover:bg-white/10" onClick={() => setMobileOpen(false)}>Profile</Link>
                <Link to="/appointments" className="rounded-md px-3 py-2 text-white/90 hover:bg-white/10" onClick={() => setMobileOpen(false)}>Appointments</Link>
                {user?.role && user.role !== 'user' && (
                  <Link to="/admin/dashboard" className="rounded-md px-3 py-2 text-white/90 hover:bg-white/10" onClick={() => setMobileOpen(false)}>Admin</Link>
                )}
                <button
                  className="mt-1 rounded-md px-3 py-2 text-left text-white/90 hover:bg-white/10"
                  onClick={() => { setMobileOpen(false); logout(); navigate('/', { replace: true }) }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  // Close on outside click / Escape
  useEffect(() => {
    function onDocClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('mousedown', onDocClick)
      window.addEventListener('keydown', onKeyDown)
    } else {
      document.removeEventListener('mousedown', onDocClick)
      window.removeEventListener('keydown', onKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const initial = (user?.name || user?.email || '').trim().charAt(0).toUpperCase() || 'U'

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white font-extrabold ring-2 ring-white/60 ring-offset-2 ring-offset-[#65A3FA] hover:bg-white/30 focus:outline-none focus-visible:ring-white"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {initial}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white shadow-xl ring-1 ring-black/5 overflow-hidden origin-top-right" role="menu" aria-label="User menu">
          {/* Caret */}
          <div className="absolute -top-2 right-4 h-4 w-4 rotate-45 bg-white border-t border-l border-slate-200" />
          <div className="px-2.5 py-1.5 border-b border-slate-200 flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700 font-extrabold">{initial}</span>
            <div className="text-xs text-slate-600 font-semibold">Account</div>
          </div>
          <nav className="p-1 text-sm text-slate-800">
            <Link to="/dashboard" className="flex items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-slate-100" role="menuitem">
              <FiUserIcon /> Profile
            </Link>
            <Link to="/appointments" className="flex items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-slate-100" role="menuitem">
              <FiCalendarIcon /> Appointments
            </Link>
            {user?.role && user.role !== 'user' && (
              <Link to="/admin/dashboard" className="flex items-center gap-2 rounded-md px-2.5 py-1.5 hover:bg-slate-100" role="menuitem">
                <FiShieldIcon /> Admin
              </Link>
            )}
          </nav>
          <div className="border-t border-slate-200 p-1">
            <button onClick={onLogout} className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-rose-600 hover:bg-rose-50" role="menuitem">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function MobileNavLink({ to, children, onNavigate, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => (
        `rounded-md px-3 py-2 text-sm ${isActive ? 'bg-[#3B82F6] text-white' : 'text-white/90 hover:bg-[#3B82F6] hover:text-white active:bg-[#2F74ED]'}`
      )}
      onClick={onNavigate}
    >
      {children}
    </NavLink>
  )
}


