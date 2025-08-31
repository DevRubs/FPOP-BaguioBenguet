import { useEffect, useRef, useState } from 'react'
import { FiBell, FiCircle, FiCheck, FiX } from 'react-icons/fi'

export default function NotificationBell({ initialCount = 0 }) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState(() => ([
    { id: 'n1', title: 'Appointment confirmed', desc: 'Your appointment is set for Friday 3:00 PM', read: false, ts: Date.now() - 60_000 },
    { id: 'n2', title: 'New resource available', desc: 'Healthy relationships 101', read: false, ts: Date.now() - 3_600_000 },
    { id: 'n3', title: 'Welcome!', desc: 'Thanks for joining FPOP online portal', read: true, ts: Date.now() - 86_400_000 },
  ]))
  const [count, setCount] = useState(() => Math.max(initialCount, items.filter(i => !i.read).length))
  const panelRef = useRef(null)

  useEffect(() => {
    setCount(items.filter(i => !i.read).length)
  }, [items])

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

  const markAllRead = () => setItems(prev => prev.map(i => ({ ...i, read: true })))
  const clearOne = (id) => setItems(prev => prev.filter(i => i.id !== id))

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
        <div className="absolute right-0 mt-2 w-56 max-w-[calc(100vw-1rem)] rounded-lg border border-slate-200 bg-white shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-slate-200">
            <div className="text-sm font-bold text-slate-700">Notifications</div>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
              onClick={markAllRead}
            >
              <FiCheck /> Mark all read
            </button>
          </div>
          <ul className="max-h-80 overflow-auto divide-y divide-slate-200">
            {items.length === 0 && (
              <li className="px-3 py-6 text-center text-sm text-slate-500 font-semibold">You're all caught up!</li>
            )}
            {items.map((n) => (
              <li key={n.id} className={`flex items-start gap-3 px-2.5 py-2 ${n.read ? 'bg-white' : 'bg-blue-50/50'}`}>
                <div className={`mt-1 h-2 w-2 rounded-full ${n.read ? 'bg-slate-300' : 'bg-blue-500'}`} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-bold text-slate-800">{n.title}</div>
                  <div className="truncate text-xs text-slate-600 font-semibold">{n.desc}</div>
                  <div className="text-[11px] text-slate-400 font-semibold">{new Date(n.ts).toLocaleString()}</div>
                </div>
                <button
                  type="button"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
                  aria-label="Dismiss"
                  onClick={() => clearOne(n.id)}
                >
                  <FiX />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between px-2.5 py-1.5 border-t border-slate-200 bg-slate-50">
            <span className="text-xs text-slate-600 font-semibold">{count} unread</span>
            <a href="/notifications" className="text-xs font-semibold text-[#1E3A8A] hover:underline">View all</a>
          </div>
        </div>
      )}
    </div>
  )
}


