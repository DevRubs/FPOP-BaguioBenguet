import { useEffect, useRef, useState } from 'react'
import { FiBell, FiCircle, FiCheck, FiX } from 'react-icons/fi'
import { api } from '../api.js'

export default function NotificationBell({ initialCount = 0 }) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [count, setCount] = useState(initialCount)
  const panelRef = useRef(null)
  const pollRef = useRef(null)
  const lastUnreadRef = useRef(initialCount)
  const POLL_MS = 10000

  useEffect(() => {
    setCount(items.filter(i => !i.read).length)
  }, [items])

  // Initial bootstrap: fetch full list once on mount
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await api.get('/api/notifications')
        if (!mounted) return
        const mapped = (res.notifications || []).map(n => ({ id: n._id, title: n.title, desc: n.body, read: n.read, ts: n.createdAt }))
        setItems(mapped)
      } catch {}
    })()
    return () => { mounted = false }
  }, [])

  // Poll unread count when panel closed and tab visible
  useEffect(() => {
    function isVisible() {
      return typeof document === 'undefined' ? true : document.visibilityState === 'visible'
    }
    async function tick() {
      try {
        const res = await api.get('/api/notifications/unread-count')
        const next = Number(res?.unreadCount || 0)
        lastUnreadRef.current = next
        setCount(next)
      } catch {}
    }

    function start() {
      if (pollRef.current) return
      pollRef.current = setInterval(() => {
        if (!open && isVisible()) tick()
      }, POLL_MS)
    }
    function stop() {
      if (pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    }

    // Start polling
    start()

    // Visibility/focus handlers
    function onVisibility() {
      if (isVisible() && !open) {
        tick()
      }
    }
    function onFocus() {
      if (!open) tick()
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', onFocus)

    // Cleanup
    return () => {
      stop()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', onFocus)
    }
  }, [open])

  useEffect(() => {
    function onDocClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
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

  // When panel opens, fetch full list fresh
  useEffect(() => {
    if (!open) return
    let mounted = true
    ;(async () => {
      try {
        const res = await api.get('/api/notifications')
        if (!mounted) return
        const mapped = (res.notifications || []).map(n => ({ id: n._id, title: n.title, desc: n.body, read: n.read, ts: n.createdAt }))
        setItems(mapped)
      } catch {}
    })()
    return () => { mounted = false }
  }, [open])

  const markAllRead = async () => {
    try { await api.post('/api/notifications/mark-all-read') } catch {}
    setItems(prev => prev.map(i => ({ ...i, read: true })))
  }
  const clearOne = async (id) => {
    try { await api.del(`/api/notifications/${id}`) } catch {}
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        aria-label={`Notifications${count > 0 ? `, ${count} unread` : ''}`}
        title="Notifications"
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#65A3FA] bg-[#65A3FA] text-white hover:bg-[#3B82F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <FiBell className="h-5 w-5 text-white" aria-hidden="true" />
        <span className="sr-only" aria-live="polite">{count} unread notifications</span>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center">
            <FiCircle className="h-5 w-5 text-white" aria-hidden="true" />
            <span className="absolute inline-flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold leading-none text-white">
              {count}
            </span>
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-1rem)] rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-200">
            <div className="text-base font-bold text-slate-700">Notifications</div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
              onClick={markAllRead}
            >
              <FiCheck /> Mark all read
            </button>
          </div>
          <ul className="max-h-[28rem] overflow-auto divide-y divide-slate-200">
            {items.length === 0 && (
              <li className="px-4 py-8 text-center text-sm sm:text-base text-slate-500 font-semibold">You're all caught up!</li>
            )}
            {items.map((n) => (
              <li key={n.id} className={`flex items-start gap-3.5 px-3.5 py-3 ${n.read ? 'bg-white' : 'bg-blue-50/50'}`}>
                <div className={`mt-1.5 h-2.5 w-2.5 rounded-full ${n.read ? 'bg-slate-300' : 'bg-blue-500'}`} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm sm:text-base font-bold text-slate-800">{n.title}</div>
                  <div className="truncate text-xs sm:text-sm text-slate-600 font-semibold">{n.desc}</div>
                  <div className="text-[11px] sm:text-xs text-slate-400 font-semibold">{new Date(n.ts).toLocaleString()}</div>
                </div>
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
                  aria-label="Dismiss"
                  onClick={() => clearOne(n.id)}
                >
                  <FiX />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between px-3.5 py-2 border-t border-slate-200 bg-slate-50">
            <span className="text-xs sm:text-sm text-slate-600 font-semibold">{count} unread</span>
            <a href="/notifications" className="text-xs sm:text-sm font-semibold text-[#1E3A8A] hover:underline">View all</a>
          </div>
        </div>
      )}
    </div>
  )
}


