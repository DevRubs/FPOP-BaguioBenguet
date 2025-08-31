import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { FiChevronRight as FiArrowRight, FiBookOpen, FiSearch, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

export default function ResourcesList() {
  const resources = [
    { id: '1', title: 'Understanding Contraceptive Options', excerpt: 'A friendly guide to choosing the method that fits your lifestyle and needs.', author: 'FPOP Team', date: new Date(), tag: 'Family Planning' },
    { id: '2', title: 'STI Myths vs Facts', excerpt: 'We bust common myths and share facts to help you stay informed and safe.', author: 'Health Educator', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), tag: 'STI Awareness' },
    { id: '3', title: 'Healthy Relationships 101', excerpt: 'Learn the basics of communication, respect, and consent in relationships.', author: 'Counseling Team', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), tag: 'Relationships' },
    { id: '4', title: 'Youth-Friendly SRH Services', excerpt: 'What to expect and how to access services tailored for young people.', author: 'FPOP Team', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9), tag: 'Youth' },
    { id: '5', title: 'Consent: What It Means', excerpt: 'Understanding consent in practical, everyday situations.', author: 'Counseling Team', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12), tag: 'Relationships' },
    { id: '6', title: 'Accessing SRH Services', excerpt: 'How to access SRH services in Baguio-Benguet.', author: 'FPOP Team', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14), tag: 'SRH Access' },
    { id: '7', title: 'PrEP and HIV Prevention', excerpt: 'An overview of PrEP and how it helps prevent HIV.', author: 'Clinic Staff', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18), tag: 'STI Awareness' },
    { id: '8', title: 'Emergency Contraception Basics', excerpt: 'What emergency contraception is and when to use it.', author: 'FPOP Team', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21), tag: 'Family Planning' },
    { id: '9', title: 'Mental Health and SRH', excerpt: 'How mental wellbeing and SRH influence each other.', author: 'Health Educator', date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 26), tag: 'Mental Health' },
  ]

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState(new Set())
  const [sortOption, setSortOption] = useState('newest') // 'newest' | 'oldest' | 'a-z' | 'z-a'
  const [pageSize] = useState(6)
  const [currentPage, setCurrentPage] = useState(1)

  const allTags = useMemo(() => {
    const tagSet = new Set(resources.map((r) => r.tag))
    return Array.from(tagSet).sort()
  }, [resources])

  const filteredAndSorted = useMemo(() => {
    const text = searchQuery.trim().toLowerCase()
    const hasTagFilter = selectedTags.size > 0
    let result = resources.filter((r) => {
      const matchesText = !text || r.title.toLowerCase().includes(text) || r.excerpt.toLowerCase().includes(text) || r.author.toLowerCase().includes(text)
      const matchesTag = !hasTagFilter || selectedTags.has(r.tag)
      return matchesText && matchesTag
    })
    switch (sortOption) {
      case 'oldest':
        result = result.sort((a, b) => a.date - b.date)
        break
      case 'a-z':
        result = result.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'z-a':
        result = result.sort((a, b) => b.title.localeCompare(a.title))
        break
      case 'newest':
      default:
        result = result.sort((a, b) => b.date - a.date)
    }
    return result
  }, [resources, searchQuery, selectedTags, sortOption])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedTags, sortOption, pageSize])

  const totalItems = filteredAndSorted.length
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, totalItems)
  const pageItems = filteredAndSorted.slice(startIndex, endIndex)

  const toggleTag = (tag) => {
    const next = new Set(selectedTags)
    if (next.has(tag)) next.delete(tag)
    else next.add(tag)
    setSelectedTags(next)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTags(new Set())
    setSortOption('newest')
    setCurrentPage(1)
  }

  return (
    <section className="px-4 md:px-8 py-8 md:py-12 font-friendly">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Resources</h1>
          <p className="text-lg md:text-xl text-slate-700 font-semibold">Articles and guides to support your sexual and reproductive health.</p>
        </header>

        {/* Controls */}
        <div className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-4 md:p-6 mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div className="relative flex-1">
                <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, authors, topics..."
                  className="w-full rounded-md border border-slate-300 bg-white px-10 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#65A3FA]"
                />
              </div>
              <div className="flex items-center gap-3">
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#65A3FA]"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="a-z">Title A–Z</option>
                  <option value="z-a">Title Z–A</option>
                </select>
                <button
                  onClick={clearFilters}
                  className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Topic chips */}
            <div className="flex flex-wrap items-center gap-2">
              {allTags.map((tag) => {
                const selected = selectedTags.has(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold transition-colors ${selected ? 'border-blue-200 bg-blue-50 text-[#1E3A8A]' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {pageItems.map((r) => (
            <article key={r.id} className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg transition-shadow hover:shadow-2xl h-full flex flex-col">
              <div className="p-5 sm:p-6 flex flex-col flex-1">
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[#1E3A8A]">
                    <FiBookOpen size={12} /> {r.tag}
                  </span>
                  <span>
                    {r.date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-900">{r.title}</h2>
                <p className="mt-2 text-base md:text-lg text-slate-700 font-medium flex-1">{r.excerpt}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-slate-500 font-semibold">By {r.author}</span>
                  <Link to={`/resources/${r.id}`} className="inline-flex items-center gap-1 text-base font-semibold text-[#65A3FA] hover:text-[#3B82F6]">
                    Read more <FiArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-8 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="text-sm text-slate-600 font-semibold">
            {totalItems === 0 ? 'No results' : `Showing ${startIndex + 1}–${endIndex} of ${totalItems}`}
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
      </div>
    </section>
  )
}


