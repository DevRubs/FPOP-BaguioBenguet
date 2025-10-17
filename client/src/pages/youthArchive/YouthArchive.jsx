import { useEffect, useState } from 'react'
import { FiCalendar, FiExternalLink, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { SiFacebook, SiInstagram, SiYoutube, SiTiktok, SiX } from 'react-icons/si'
import { api } from '../../api.js'

function getPlatform(url) {
  const lower = url.toLowerCase()
  if (lower.includes('facebook')) return { name: 'Facebook', Icon: SiFacebook, color: 'text-[#1877F2]' }
  if (lower.includes('instagram')) return { name: 'Instagram', Icon: SiInstagram, color: 'text-[#E1306C]' }
  if (lower.includes('youtube')) return { name: 'YouTube', Icon: SiYoutube, color: 'text-[#FF0000]' }
  if (lower.includes('tiktok')) return { name: 'TikTok', Icon: SiTiktok, color: 'text-black' }
  if (lower.includes('twitter') || lower.includes('x.com')) return { name: 'X (Twitter)', Icon: SiX, color: 'text-black' }
  return { name: 'Post', Icon: FiExternalLink, color: 'text-slate-700' }
}

export default function YouthArchive() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, pages: 1 })
  const pageSize = 4

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setLoading(true)
      setError('')
      try {
        const res = await api.get(`/api/youth-archive?page=${currentPage}&limit=${pageSize}`)
        if (!mounted) return
        setItems(res.items || [])
        setPagination(res.pagination || { total: 0, pages: 1 })
      } catch (err) {
        if (!mounted) return
        setError(err?.message || 'Failed to load archive items')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [currentPage])

  const totalItems = pagination.total
  const totalPages = pagination.pages
  const safeCurrentPage = Math.min(currentPage, totalPages)

  return (
    <section className="px-4 md:px-8 py-8 md:py-12 font-friendly">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Youth Archive</h1>
          <p className="text-lg md:text-xl text-slate-700 font-semibold">Past events and activities. Click a card to view the original social media post.</p>
        </header>

        {/* Timeline list */}
        <div className="relative">
          {loading && (
            <div className="rounded-xl border-2 border-dashed border-slate-300 p-6 text-center text-slate-600 font-semibold">
              Loading archive items...
            </div>
          )}
          {!loading && error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-rose-700 font-semibold">
              {error}
            </div>
          )}
          {!loading && !error && items.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-slate-300 p-6 text-center text-slate-600 font-semibold">
              No archive items found.
            </div>
          )}
          {!loading && !error && items.length > 0 && (
            <>
              <div className="absolute left-5 top-0 bottom-0 w-px bg-slate-300" />
              <div className="space-y-6">
                {items.map((event) => (
                  <div key={event._id} className="relative pl-12">
                    <span className="absolute left-4 top-5 h-3 w-3 rounded-full bg-[#65A3FA] ring-2 ring-white shadow" />
                    <ArchiveCard event={event} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-8 flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="text-sm text-slate-600 font-semibold">
              {totalItems === 0 ? 'No posts' : `Page ${safeCurrentPage} of ${totalPages} (${totalItems} total)`}
            </div>
          <div className="flex items-center gap-2">
            <button
              disabled={safeCurrentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 disabled:opacity-50 hover:bg-slate-50"
            >
              <FiChevronLeft size={16} /> Prev
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNumber = i + 1
                const isActive = pageNumber === safeCurrentPage
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`h-9 w-9 rounded-md border text-sm font-semibold ${isActive ? 'border-blue-200 bg-blue-50 text-[#1E3A8A]' : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {pageNumber}
                  </button>
                )
              })}
            </div>
            <button
              disabled={safeCurrentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 disabled:opacity-50 hover:bg-slate-50"
            >
              Next <FiChevronRight size={16} />
            </button>
          </div>
        </div>
        )}
      </div>
    </section>
  )
}

function ArchiveCard({ event }) {
  const p = getPlatform(event.url)
  const Icon = p.Icon
  return (
    <a
      href={event.url}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-4 md:p-5 transition-shadow hover:shadow-2xl"
      title={`Open on ${p.name}`}
    >
      <div className="flex items-start gap-3">
        <div className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 ${p.color}`}>
          <Icon />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg md:text-xl font-extrabold text-slate-900">{event.title}</h2>
          {event.note && (
            <p className="mt-1 text-sm md:text-base text-slate-700 font-semibold line-clamp-2">{event.note}</p>
          )}
          <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
            <FiCalendar /> {new Date(event.date).toLocaleDateString()}
            <span className="mx-1">•</span>
            <span className="text-slate-700">{p.name}</span>
          </div>
        </div>
        <FiExternalLink className="opacity-0 group-hover:opacity-100 text-slate-500" />
      </div>
    </a>
  )
}

