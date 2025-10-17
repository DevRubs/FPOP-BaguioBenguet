import { useEffect, useState } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiEyeOff, FiExternalLink } from 'react-icons/fi'
import { SiFacebook, SiInstagram, SiYoutube, SiTiktok, SiX } from 'react-icons/si'
import AdminPageHeader from '../../../components/AdminPageHeader'
import { api } from '../../../api.js'

function getPlatformIcon(platform) {
  switch (platform) {
    case 'facebook': return { Icon: SiFacebook, color: 'text-[#1877F2]' }
    case 'instagram': return { Icon: SiInstagram, color: 'text-[#E1306C]' }
    case 'youtube': return { Icon: SiYoutube, color: 'text-[#FF0000]' }
    case 'tiktok': return { Icon: SiTiktok, color: 'text-black' }
    case 'twitter': return { Icon: SiX, color: 'text-black' }
    default: return { Icon: FiExternalLink, color: 'text-slate-700' }
  }
}

function getPlatformName(platform) {
  switch (platform) {
    case 'facebook': return 'Facebook'
    case 'instagram': return 'Instagram'
    case 'youtube': return 'YouTube'
    case 'tiktok': return 'TikTok'
    case 'twitter': return 'X (Twitter)'
    default: return 'Other'
  }
}

export default function AdminYouthArchive() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [platform, setPlatform] = useState('')
  const [isActive, setIsActive] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({ title: '', date: '', url: '', note: '', isActive: true })
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    loadItems()
  }, [currentPage, search, platform, isActive])

  const loadItems = async () => {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      params.set('page', currentPage)
      params.set('limit', '20')
      if (search) params.set('search', search)
      if (platform) params.set('platform', platform)
      if (isActive !== '') params.set('isActive', isActive)
      
      const res = await api.get(`/api/youth-archive/admin/all?${params.toString()}`)
      setItems(res.items || [])
      setPagination(res.pagination || { total: 0, pages: 1 })
    } catch (err) {
      setError(err?.message || 'Failed to load archive items')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingItem(null)
    setFormData({ title: '', date: '', url: '', note: '', isActive: true })
    setShowModal(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      date: new Date(item.date).toISOString().split('T')[0],
      url: item.url,
      note: item.note || '',
      isActive: item.isActive
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.title || !formData.date || !formData.url) {
      alert('Please fill in all required fields')
      return
    }

    setSaving(true)
    try {
      if (editingItem) {
        await api.patch(`/api/youth-archive/admin/${editingItem._id}`, formData)
      } else {
        await api.post('/api/youth-archive/admin', formData)
      }
      setShowModal(false)
      loadItems()
    } catch (err) {
      alert(err?.message || 'Failed to save archive item')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this archive item?')) return
    
    setDeletingId(id)
    try {
      await api.del(`/api/youth-archive/admin/${id}`)
      loadItems()
    } catch (err) {
      alert(err?.message || 'Failed to delete archive item')
    } finally {
      setDeletingId(null)
    }
  }

  const toggleActive = async (item) => {
    try {
      await api.patch(`/api/youth-archive/admin/${item._id}`, { isActive: !item.isActive })
      loadItems()
    } catch (err) {
      alert(err?.message || 'Failed to update archive item')
    }
  }

  return (
    <div>
      <AdminPageHeader title="Youth Archive Management" description="Manage youth archive items and social media posts">
        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-2 rounded-md bg-[#65A3FA] px-4 py-2 text-white font-semibold hover:bg-[#3B82F6]"
        >
          <FiPlus /> Add Archive Item
        </button>
      </AdminPageHeader>

      {/* Filters */}
      <div className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 md:items-center">
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or note..."
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">All Platforms</option>
              <option value="facebook">Facebook</option>
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="twitter">Twitter</option>
              <option value="other">Other</option>
            </select>
            <select
              value={isActive}
              onChange={(e) => setIsActive(e.target.value)}
              className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-2xl border border-[#65A3FA] bg-white shadow-lg">
        <table className="min-w-full table-fixed text-sm">
          <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
            <tr className="text-left text-slate-600">
              <th className="px-4 md:px-6 py-3 font-extrabold w-64">Title</th>
              <th className="px-4 md:px-6 py-3 font-extrabold w-32">Date</th>
              <th className="px-4 md:px-6 py-3 font-extrabold w-32">Platform</th>
              <th className="px-4 md:px-6 py-3 font-extrabold w-48">URL</th>
              <th className="px-4 md:px-6 py-3 font-extrabold w-32">Status</th>
              <th className="px-4 md:px-6 py-3 font-extrabold w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="px-4 md:px-6 py-6 text-center text-slate-500">Loading...</td></tr>
            )}
            {!loading && error && (
              <tr><td colSpan={6} className="px-4 md:px-6 py-6 text-center text-rose-600">{error}</td></tr>
            )}
            {!loading && !error && items.length === 0 && (
              <tr><td colSpan={6} className="px-4 md:px-6 py-6 text-center text-slate-500">No archive items found</td></tr>
            )}
            {items.map((item) => {
              const { Icon, color } = getPlatformIcon(item.platform)
              return (
                <tr key={item._id} className="border-t border-slate-100 even:bg-slate-50/40 hover:bg-slate-50 transition-colors">
                  <td className="px-4 md:px-6 py-3">
                    <div className="font-semibold text-slate-900">{item.title}</div>
                    {item.note && (
                      <div className="text-xs text-slate-600 mt-1 line-clamp-2">{item.note}</div>
                    )}
                  </td>
                  <td className="px-4 md:px-6 py-3 whitespace-nowrap">{new Date(item.date).toLocaleDateString()}</td>
                  <td className="px-4 md:px-6 py-3">
                    <div className="flex items-center gap-2">
                      <Icon className={`${color}`} size={16} />
                      <span className="text-sm">{getPlatformName(item.platform)}</span>
                    </div>
                  </td>
                  <td className="px-4 md:px-6 py-3">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm truncate block max-w-48"
                      title={item.url}
                    >
                      {item.url}
                    </a>
                  </td>
                  <td className="px-4 md:px-6 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${
                      item.isActive 
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200' 
                        : 'text-slate-700 bg-slate-100 border-slate-300'
                    }`}>
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-3">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="rounded-full border border-slate-300 bg-slate-100 p-1.5 text-slate-700 hover:bg-slate-200"
                        title="Edit"
                      >
                        <FiEdit2 size={14} />
                      </button>
                      <button
                        onClick={() => toggleActive(item)}
                        className={`rounded-full border p-1.5 ${
                          item.isActive 
                            ? 'border-amber-300 bg-amber-100 text-amber-700 hover:bg-amber-200' 
                            : 'border-emerald-300 bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        }`}
                        title={item.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {item.isActive ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        disabled={deletingId === item._id}
                        className="rounded-full border border-rose-300 bg-rose-100 p-1.5 text-rose-700 hover:bg-rose-200 disabled:opacity-50"
                        title="Delete"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && !error && pagination.pages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 disabled:opacity-50 hover:bg-slate-50"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-slate-600">
              Page {currentPage} of {pagination.pages}
            </span>
            <button
              disabled={currentPage >= pagination.pages}
              onClick={() => setCurrentPage(p => Math.min(pagination.pages, p + 1))}
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 disabled:opacity-50 hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">
              {editingItem ? 'Edit Archive Item' : 'Add Archive Item'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Event title"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">URL *</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Note</label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  rows={3}
                  placeholder="Optional description"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded border-slate-300"
                />
                <label htmlFor="isActive" className="text-sm font-semibold text-slate-700">
                  Active (visible to users)
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 rounded-md border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-md bg-[#65A3FA] px-4 py-2 text-white font-semibold hover:bg-[#3B82F6] disabled:opacity-50"
              >
                {saving ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
