import { useEffect, useRef, useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const drawerRef = useRef(null)
  const previouslyFocusedRef = useRef(null)

  // Body scroll lock when drawer is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = originalOverflow
    }
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isSidebarOpen])

  // Focus management and Escape close
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        setIsSidebarOpen(false)
      }
      if (e.key === 'Tab' && isSidebarOpen && drawerRef.current) {
        const focusable = drawerRef.current.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
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

    if (isSidebarOpen) {
      previouslyFocusedRef.current = document.activeElement
      const focusable = drawerRef.current?.querySelector('a[href], button, [tabindex]:not([tabindex="-1"])')
      if (focusable) {
        focusable.focus()
      }
      window.addEventListener('keydown', onKeyDown)
    } else {
      window.removeEventListener('keydown', onKeyDown)
      const prev = previouslyFocusedRef.current
      if (prev && prev.focus) prev.focus()
    }

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isSidebarOpen])

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Mobile slide-in sidebar */}
      <div
        ref={drawerRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white transition-transform duration-200 md:hidden ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Admin navigation"
        aria-hidden={!isSidebarOpen}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2">
          <div className="text-sm text-slate-700">Admin</div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="rounded border border-slate-300 bg-slate-100 p-1 text-slate-700 hover:bg-slate-200"
            aria-label="Close menu"
          >
            <FiX size={18} />
          </button>
        </div>
        <div className="flex h-[calc(100vh-40px)] min-h-0 flex-col overflow-hidden">
          <AdminSidebar onNavigate={() => setIsSidebarOpen(false)} />
        </div>
      </div>

      <div className="w-full min-h-screen grid grid-cols-12 gap-0">
        {/* Desktop sidebar */}
        <aside className="hidden md:block col-span-12 md:col-span-2 lg:col-span-2 xl:col-span-2 bg-white border-r border-slate-200 md:sticky md:top-0 md:h-screen md:self-start">
          <AdminSidebar />
        </aside>

        <main className="col-span-12 md:col-span-10 lg:col-span-10 xl:col-span-10 overflow-x-auto">
          {/* Mobile top bar */}
          <div className="md:hidden sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/70 px-4 py-3 backdrop-blur">
            <button
              className="inline-flex items-center justify-center rounded border border-slate-300 bg-slate-100 p-2 text-slate-700 hover:bg-slate-200"
              onClick={() => setIsSidebarOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={isSidebarOpen}
            >
              <FiMenu size={18} />
            </button>
            <div className="text-sm text-slate-700">Admin</div>
          </div>

          <div className="px-4 md:px-8 py-8 md:py-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}



