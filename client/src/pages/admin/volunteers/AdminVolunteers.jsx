import { useEffect, useState } from 'react'
import AdminPageHeader from '../../../components/AdminPageHeader'
import { api } from '../../../api.js'

function StatusBadge({ status }) {
  const map = {
    pending: 'text-amber-700 bg-amber-50 border-amber-200',
    approved: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    rejected: 'text-rose-700 bg-rose-50 border-rose-200',
    withdrawn: 'text-slate-700 bg-slate-100 border-slate-300',
  }
  const cls = map[status] || map.pending
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${cls}`}>{status}</span>
}

export default function AdminVolunteers() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('all')
  const [q, setQ] = useState('')
  const [updatingById, setUpdatingById] = useState({})

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const params = new URLSearchParams()
        if (status !== 'all') params.set('status', status)
        if (q.trim()) params.set('q', q.trim())
        const res = await api.get(`/api/volunteers/admin/all${params.toString() ? `?${params.toString()}` : ''}`)
        if (!mounted) return
        setItems(res.applications || [])
      } catch (err) {
        if (!mounted) return
        setError(err?.message || 'Failed to load applications')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [status, q])

  async function updateStatus(id, newStatus) {
    if (updatingById[id]) return
    const current = items.find((it) => it._id === id)
    if (current && current.status === newStatus) return
    setUpdatingById((m) => ({ ...m, [id]: true }))
    try {
      await api.patch(`/api/volunteers/admin/${id}/status`, { status: newStatus })
      setItems((prev) => prev.map((it) => (it._id === id ? { ...it, status: newStatus } : it)))
    } catch (err) {
      alert(err?.message || 'Failed to update')
    } finally {
      setUpdatingById((m) => ({ ...m, [id]: false }))
    }
  }

  // Notes functionality removed per request

  return (
    <div>
      <AdminPageHeader title="Admin Volunteers" description="Review and manage volunteer applications" />

      <div className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-4 md:p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex items-center gap-3">
            <label className="text-base md:text-lg font-extrabold text-slate-900">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm">
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-base md:text-lg font-extrabold text-slate-900">Search</label>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, email, phone, motivation" className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm w-64" />
          </div>
        </div>
      </div>

      <div className="overflow-auto rounded-2xl border border-[#65A3FA] bg-white shadow-lg">
        <table className="min-w-full table-fixed text-sm">
          <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
            <tr className="text-left text-slate-600">
              <th className="px-4 md:px-6 py-3 font-extrabold w-48">Submitted</th>
              <th className="px-4 md:px-6 py-3 font-extrabold w-48">Full name</th>
              <th className="px-4 md:px-6 py-3 font-extrabold w-64">Email</th>
              <th className="px-4 md:px-6 py-3 font-extrabold w-40">Phone</th>
              <th className="px-4 md:px-6 py-3 font-extrabold w-40">City</th>
              <th className="px-4 md:px-6 py-3 font-extrabold w-64">Availability</th>
              <th className="px-4 md:px-6 py-3 font-extrabold w-64">Skills</th>
              <th className="px-4 md:px-6 py-3 font-extrabold w-96">Motivation</th>
              <th className="px-4 md:px-6 py-3 font-extrabold w-40">Status</th>
              <th className="px-4 md:px-6 py-3 font-extrabold w-64">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={10} className="px-4 md:px-6 py-6 text-center text-slate-500">Loading...</td></tr>
            )}
            {!loading && error && (
              <tr><td colSpan={10} className="px-4 md:px-6 py-6 text-center text-rose-600">{error}</td></tr>
            )}
            {!loading && !error && items.length === 0 && (
              <tr><td colSpan={10} className="px-4 md:px-6 py-6 text-center text-slate-500">No applications</td></tr>
            )}
            {items.map((it) => (
              <tr key={it._id} className="border-t border-slate-100 align-top even:bg-slate-50/40 hover:bg-slate-50 transition-colors">
                <td className="px-4 md:px-6 py-3 whitespace-nowrap text-ellipsis overflow-hidden" title={new Date(it.createdAt).toLocaleString()}>{new Date(it.createdAt).toLocaleString()}</td>
                <td className="px-4 md:px-6 py-3 whitespace-nowrap text-ellipsis overflow-hidden" title={it.fullName}>{it.fullName}</td>
                <td className="px-4 md:px-6 py-3 whitespace-nowrap overflow-hidden text-ellipsis" title={it.email}>{it.email}</td>
                <td className="px-4 md:px-6 py-3 whitespace-nowrap text-ellipsis overflow-hidden" title={it.phone}>{it.phone}</td>
                <td className="px-4 md:px-6 py-3 whitespace-nowrap text-ellipsis overflow-hidden" title={it.city || '-'}>{it.city || '-'}</td>
                <td className="px-4 md:px-6 py-3 whitespace-pre-wrap break-words">{it.availability || '-'}</td>
                <td className="px-4 md:px-6 py-3 whitespace-pre-wrap break-words">{Array.isArray(it.skills) ? it.skills.join(', ') : (it.skills || '-')}</td>
                <td className="px-4 md:px-6 py-3 whitespace-pre-wrap break-words">{it.motivation || '-'}</td>
                <td className="px-4 md:px-6 py-3"><StatusBadge status={it.status} /></td>
                <td className="px-4 md:px-6 py-3 whitespace-nowrap">
                  <div className="inline-flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => updateStatus(it._id, 'approved')}
                      disabled={Boolean(updatingById[it._id]) || it.status !== 'pending'}
                      className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${it.status === 'pending' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-emerald-100 bg-emerald-50/70 text-emerald-400'} ${updatingById[it._id] ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {updatingById[it._id] ? 'Updating…' : 'Approve'}
                    </button>
                    <button
                      onClick={() => updateStatus(it._id, 'rejected')}
                      disabled={Boolean(updatingById[it._id]) || it.status !== 'pending'}
                      className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${it.status === 'pending' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-rose-200 bg-rose-50/70 text-rose-400'} ${updatingById[it._id] ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {updatingById[it._id] ? 'Updating…' : 'Reject'}
                    </button>
                    <button
                      onClick={() => updateStatus(it._id, 'pending')}
                      disabled={Boolean(updatingById[it._id]) || it.status === 'pending'}
                      className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${it.status === 'pending' ? 'border-slate-200 bg-slate-100/70 text-slate-400' : 'border-slate-300 bg-slate-100 text-slate-700'} ${updatingById[it._id] ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {updatingById[it._id] ? 'Updating…' : 'Set Pending'}
                    </button>
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



