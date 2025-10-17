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
    try {
      await api.patch(`/api/appointments/admin/${id}/status`, { status: newStatus })
      setItems((prev) => prev.map((it) => (it._id === id ? { ...it, status: newStatus } : it)))
    } catch (err) {
      alert(err?.message || 'Failed to update')
    }
  }

  return (
    <div>
      <AdminPageHeader title="Admin Appointments" description="Review and manage all appointments" />
      <div className="rounded-lg border border-slate-200 bg-white p-3 mb-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-700">Filter:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm">
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">
              <th className="px-3 py-2 font-semibold">When</th>
              <th className="px-3 py-2 font-semibold">Type</th>
              <th className="px-3 py-2 font-semibold">User</th>
              <th className="px-3 py-2 font-semibold">Location</th>
              <th className="px-3 py-2 font-semibold">Status</th>
              <th className="px-3 py-2 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="px-3 py-4 text-center text-slate-500">Loading...</td></tr>
            )}
            {!loading && error && (
              <tr><td colSpan={6} className="px-3 py-4 text-center text-rose-600">{error}</td></tr>
            )}
            {!loading && !error && items.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-4 text-center text-slate-500">No appointments</td></tr>
            )}
            {items.map((it) => (
              <tr key={it._id} className="border-t border-slate-100">
                <td className="px-3 py-2 whitespace-nowrap">{new Date(it.startAt).toLocaleString()}</td>
                <td className="px-3 py-2 capitalize">{it.type}</td>
                <td className="px-3 py-2">{it.user?.name || it.user?.email || it.user}</td>
                <td className="px-3 py-2">{it.location}</td>
                <td className="px-3 py-2"><StatusBadge status={it.status} /></td>
                <td className="px-3 py-2">
                  <div className="inline-flex items-center gap-2">
                    <button onClick={() => updateStatus(it._id, 'confirmed')} className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-700">Confirm</button>
                    <button onClick={() => updateStatus(it._id, 'completed')} className="rounded border border-slate-300 bg-slate-100 px-2 py-1 text-slate-700">Complete</button>
                    <button onClick={() => updateStatus(it._id, 'cancelled')} className="rounded border border-rose-200 bg-rose-50 px-2 py-1 text-rose-700">Cancel</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


