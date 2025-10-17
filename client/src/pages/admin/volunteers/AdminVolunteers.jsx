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

  async function updateNotes(id, notes) {
    if (updatingById[id]) return
    setUpdatingById((m) => ({ ...m, [id]: true }))
    try {
      await api.patch(`/api/volunteers/admin/${id}/notes`, { notes })
      setItems((prev) => prev.map((it) => (it._id === id ? { ...it, notes } : it)))
    } catch (err) {
      alert(err?.message || 'Failed to save notes')
    } finally {
      setUpdatingById((m) => ({ ...m, [id]: false }))
    }
  }

  return (
    <div>
      <AdminPageHeader title="Admin Volunteers" description="Review and manage volunteer applications" />

      <div className="rounded-lg border border-slate-200 bg-white p-3 mb-3">
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-slate-700">Status:</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm">
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-slate-700">Search:</label>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, email, phone, motivation" className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm w-64" />
          </div>
        </div>
      </div>

      <div className="overflow-auto rounded-lg border border-slate-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-slate-600">
              <th className="px-3 py-2 font-semibold">Submitted</th>
              <th className="px-3 py-2 font-semibold">Full name</th>
              <th className="px-3 py-2 font-semibold">Email</th>
              <th className="px-3 py-2 font-semibold">Phone</th>
              <th className="px-3 py-2 font-semibold">City</th>
              <th className="px-3 py-2 font-semibold">Availability</th>
              <th className="px-3 py-2 font-semibold">Skills</th>
              <th className="px-3 py-2 font-semibold">Motivation</th>
              <th className="px-3 py-2 font-semibold">Status</th>
              <th className="px-3 py-2 font-semibold">Notes</th>
              <th className="px-3 py-2 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={11} className="px-3 py-4 text-center text-slate-500">Loading...</td></tr>
            )}
            {!loading && error && (
              <tr><td colSpan={11} className="px-3 py-4 text-center text-rose-600">{error}</td></tr>
            )}
            {!loading && !error && items.length === 0 && (
              <tr><td colSpan={11} className="px-3 py-4 text-center text-slate-500">No applications</td></tr>
            )}
            {items.map((it) => (
              <tr key={it._id} className="border-t border-slate-100 align-top">
                <td className="px-3 py-2 whitespace-nowrap">{new Date(it.createdAt).toLocaleString()}</td>
                <td className="px-3 py-2 whitespace-nowrap">{it.fullName}</td>
                <td className="px-3 py-2 whitespace-nowrap">{it.email}</td>
                <td className="px-3 py-2 whitespace-nowrap">{it.phone}</td>
                <td className="px-3 py-2 whitespace-nowrap">{it.city || '-'}</td>
                <td className="px-3 py-2 whitespace-pre-wrap break-words">{it.availability || '-'}</td>
                <td className="px-3 py-2 whitespace-pre-wrap break-words max-w-xs">{Array.isArray(it.skills) ? it.skills.join(', ') : (it.skills || '-')}</td>
                <td className="px-3 py-2 whitespace-pre-wrap break-words max-w-sm">{it.motivation || '-'}</td>
                <td className="px-3 py-2"><StatusBadge status={it.status} /></td>
                <td className="px-3 py-2 w-[18rem]">
                  <textarea
                    defaultValue={it.notes || ''}
                    onBlur={(e) => {
                      const v = e.target.value
                      if (v !== (it.notes || '')) updateNotes(it._id, v)
                    }}
                    className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
                    placeholder="Add admin notes and click away to save"
                  />
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="inline-flex items-center gap-2">
                    <button
                      onClick={() => updateStatus(it._id, 'approved')}
                      disabled={Boolean(updatingById[it._id]) || it.status !== 'pending'}
                      className={`rounded border px-2 py-1 ${it.status === 'pending' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-emerald-100 bg-emerald-50/70 text-emerald-400'} ${updatingById[it._id] ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {updatingById[it._id] ? 'Updating…' : 'Approve'}
                    </button>
                    <button
                      onClick={() => updateStatus(it._id, 'rejected')}
                      disabled={Boolean(updatingById[it._id]) || it.status !== 'pending'}
                      className={`rounded border px-2 py-1 ${it.status === 'pending' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-rose-200 bg-rose-50/70 text-rose-400'} ${updatingById[it._id] ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {updatingById[it._id] ? 'Updating…' : 'Reject'}
                    </button>
                    <button
                      onClick={() => updateStatus(it._id, 'pending')}
                      disabled={Boolean(updatingById[it._id]) || it.status === 'pending'}
                      className={`rounded border px-2 py-1 ${it.status === 'pending' ? 'border-slate-200 bg-slate-100/70 text-slate-400' : 'border-slate-300 bg-slate-100 text-slate-700'} ${updatingById[it._id] ? 'opacity-60 cursor-not-allowed' : ''}`}
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



