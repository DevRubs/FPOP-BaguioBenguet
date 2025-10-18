import { useEffect, useState } from 'react'
import AdminPageHeader from '../../../components/AdminPageHeader'
import { api } from '../../../api.js'

function StatusBadge({ status }) {
  const map = {
    pending: 'text-amber-700 bg-amber-50 border-amber-200',
    confirmed: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    completed: 'text-slate-700 bg-slate-100 border-slate-300',
    cancelled: 'text-rose-700 bg-rose-50 border-rose-200',
  }
  const cls = map[status] || map.completed
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${cls}`}>{status}</span>
}

export default function AdminAppointments() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('all')
  const [updatingById, setUpdatingById] = useState({})

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const params = new URLSearchParams()
        if (status !== 'all') params.set('status', status)
        const res = await api.get(`/api/appointments/admin/all${params.toString() ? `?${params.toString()}` : ''}`)
        if (!mounted) return
        setItems(res.appointments || [])
      } catch (err) {
        if (!mounted) return
        setError(err?.message || 'Failed to load appointments')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [status])

  async function updateStatus(id, newStatus) {
    // Guard: prevent duplicate clicks and no-op updates
    if (updatingById[id]) return
    const current = items.find((it) => it._id === id)
    if (current && current.status === newStatus) return

    setUpdatingById((m) => ({ ...m, [id]: true }))
    try {
      await api.patch(`/api/appointments/admin/${id}/status`, { status: newStatus })
      setItems((prev) => prev.map((it) => (it._id === id ? { ...it, status: newStatus } : it)))
    } catch (err) {
      alert(err?.message || 'Failed to update')
    } finally {
      setUpdatingById((m) => ({ ...m, [id]: false }))
    }
  }

  return (
    <div>
      <AdminPageHeader title="Admin Appointments" description="Review and manage all appointments" />
      <div className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-4 md:p-6 mb-6">
        <div className="flex items-center gap-3">
          <label className="text-base md:text-lg font-extrabold text-slate-900">Filter</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Desktop/Tablet Table View */}
      <div className="hidden lg:block overflow-auto rounded-2xl border border-[#65A3FA] bg-white shadow-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
            <tr className="text-left text-slate-600">
              <th className="px-3 py-2 font-extrabold">When</th>
              <th className="px-3 py-2 font-extrabold">Type</th>
              <th className="px-3 py-2 font-extrabold">Name</th>
              <th className="px-3 py-2 font-extrabold">User</th>
              <th className="px-3 py-2 font-extrabold">Phone</th>
              <th className="px-3 py-2 font-extrabold">Notes</th>
              <th className="px-3 py-2 font-extrabold">Status</th>
              <th className="px-3 py-2 font-extrabold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={8} className="px-4 md:px-6 py-6 text-center text-slate-500">Loading...</td></tr>
            )}
            {!loading && error && (
              <tr><td colSpan={8} className="px-4 md:px-6 py-6 text-center text-rose-600">{error}</td></tr>
            )}
            {!loading && !error && items.length === 0 && (
              <tr><td colSpan={8} className="px-4 md:px-6 py-6 text-center text-slate-500">No appointments</td></tr>
            )}
            {items.map((it) => (
              <tr key={it._id} className="border-t border-slate-100 align-top even:bg-slate-50/40 hover:bg-slate-50 transition-colors">
                <td className="px-3 py-2 whitespace-nowrap">{new Date(it.startAt).toLocaleString()}</td>
                <td className="px-3 py-2 capitalize">{it.type}</td>
                <td className="px-3 py-2 whitespace-nowrap">{it.clientName || '-'}</td>
                <td className="px-3 py-2">{it.user?.email || it.user?.name || it.user}</td>
                <td className="px-3 py-2 whitespace-nowrap">{it.phone || '-'}</td>
                <td className="px-3 py-2 max-w-xs whitespace-pre-wrap break-words text-slate-700">{it.notes || '-'}</td>
                <td className="px-3 py-2"><StatusBadge status={it.status} /></td>
                <td className="px-3 py-2">
                  <div className="inline-flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => updateStatus(it._id, 'confirmed')}
                      disabled={Boolean(updatingById[it._id]) || it.status !== 'pending'}
                      className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${it.status === 'pending' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-emerald-100 bg-emerald-50/70 text-emerald-400'} ${updatingById[it._id] ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {updatingById[it._id] ? 'Updating…' : 'Confirm'}
                    </button>
                    <button
                      onClick={() => updateStatus(it._id, 'completed')}
                      disabled={Boolean(updatingById[it._id]) || it.status !== 'confirmed'}
                      className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${it.status === 'confirmed' ? 'border-slate-300 bg-slate-100 text-slate-700' : 'border-slate-200 bg-slate-100/70 text-slate-400'} ${updatingById[it._id] ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {updatingById[it._id] ? 'Updating…' : 'Complete'}
                    </button>
                    <button
                      onClick={() => updateStatus(it._id, 'cancelled')}
                      disabled={Boolean(updatingById[it._id]) || it.status === 'completed' || it.status === 'cancelled'}
                      className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${it.status === 'completed' || it.status === 'cancelled' ? 'border-rose-200 bg-rose-50/70 text-rose-400' : 'border-rose-200 bg-rose-50 text-rose-700'} ${updatingById[it._id] ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {updatingById[it._id] ? 'Updating…' : 'Cancel'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {loading && (
          <div className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-6 text-center text-slate-500">
            Loading...
          </div>
        )}
        {!loading && error && (
          <div className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-6 text-center text-rose-600">
            {error}
          </div>
        )}
        {!loading && !error && items.length === 0 && (
          <div className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-6 text-center text-slate-500">
            No appointments
          </div>
        )}
        {items.map((it, index) => (
          <div key={it._id} className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-4 space-y-3">
            {/* Header with appointment time, type, and status */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 text-lg">{new Date(it.startAt).toLocaleString()}</h3>
                <p className="text-sm text-slate-600 capitalize">{it.type} appointment</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={it.status} />
              </div>
            </div>

            {/* Client Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Client Name</label>
                <p className="text-sm text-slate-900">{it.clientName || '-'}</p>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone</label>
                <p className="text-sm text-slate-900">{it.phone || '-'}</p>
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">User</label>
                <p className="text-sm text-slate-900">{it.user?.email || it.user?.name || it.user || '-'}</p>
              </div>
            </div>

            {/* Notes */}
            {it.notes && (
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Notes</label>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{it.notes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => updateStatus(it._id, 'confirmed')}
                  disabled={Boolean(updatingById[it._id]) || it.status !== 'pending'}
                  className={`flex-1 sm:flex-none rounded-full border px-4 py-2 text-sm font-semibold ${it.status === 'pending' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-emerald-100 bg-emerald-50/70 text-emerald-400'} ${updatingById[it._id] ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {updatingById[it._id] ? 'Updating…' : 'Confirm'}
                </button>
                <button
                  onClick={() => updateStatus(it._id, 'completed')}
                  disabled={Boolean(updatingById[it._id]) || it.status !== 'confirmed'}
                  className={`flex-1 sm:flex-none rounded-full border px-4 py-2 text-sm font-semibold ${it.status === 'confirmed' ? 'border-slate-300 bg-slate-100 text-slate-700' : 'border-slate-200 bg-slate-100/70 text-slate-400'} ${updatingById[it._id] ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {updatingById[it._id] ? 'Updating…' : 'Complete'}
                </button>
                <button
                  onClick={() => updateStatus(it._id, 'cancelled')}
                  disabled={Boolean(updatingById[it._id]) || it.status === 'completed' || it.status === 'cancelled'}
                  className={`flex-1 sm:flex-none rounded-full border px-4 py-2 text-sm font-semibold ${it.status === 'completed' || it.status === 'cancelled' ? 'border-rose-200 bg-rose-50/70 text-rose-400' : 'border-rose-200 bg-rose-50 text-rose-700'} ${updatingById[it._id] ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  {updatingById[it._id] ? 'Updating…' : 'Cancel'}
                </button>
              </div>
            </div>
            {/* Separator line - only show if not the last item */}
            {index < items.length - 1 && (
              <div className="pt-4">
                <div className="border-t border-slate-200"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}


