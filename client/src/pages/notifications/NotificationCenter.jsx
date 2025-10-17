import { useEffect, useState } from 'react'
import { api } from '../../api.js'

export default function NotificationCenter() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    setError('')
    try {
      const res = await api.get('/api/notifications')
      setItems((res.notifications || []).map(n => ({ id: n._id, title: n.title, body: n.body, read: n.read, ts: n.createdAt })))
    } catch (err) {
      setError(err?.message || 'Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function markAll() {
    try { await api.post('/api/notifications/mark-all-read') } catch {}
    load()
  }

  async function markOne(id) {
    try { await api.post(`/api/notifications/${id}/read`) } catch {}
    setItems(prev => prev.map(i => i.id === id ? { ...i, read: true } : i))
  }

  return (
    <section className="px-4 md:px-8 py-8 md:py-12 font-friendly">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 md:mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-1">Notifications</h1>
            <p className="text-lg md:text-xl text-slate-700 font-semibold">Your latest updates</p>
          </div>
          <button onClick={markAll} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50">Mark all read</button>
        </header>

        <div className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg">
          {loading && <div className="p-6 text-center text-slate-600 font-semibold">Loading...</div>}
          {!loading && error && <div className="p-6 text-center text-rose-600 font-semibold">{error}</div>}
          {!loading && !error && items.length === 0 && <div className="p-6 text-center text-slate-600 font-semibold">You're all caught up!</div>}
          <ul className="divide-y divide-slate-200">
            {items.map(n => (
              <li key={n.id} className={`p-4 sm:p-5 ${n.read ? 'bg-white' : 'bg-blue-50/50'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-base font-bold text-slate-800 truncate">{n.title}</div>
                    <div className="text-sm text-slate-600 font-semibold truncate">{n.body}</div>
                    <div className="text-[11px] text-slate-400 font-semibold">{new Date(n.ts).toLocaleString()}</div>
                  </div>
                  {!n.read && (
                    <button onClick={() => markOne(n.id)} className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 shrink-0">Mark read</button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}


