import { Link } from 'react-router-dom'
import { FiChevronRight as FiArrowRight } from 'react-icons/fi'

function LatestResourcesSection() {
  const resources = [
    {
      id: '1',
      title: 'Understanding Contraceptive Options',
      excerpt: 'A friendly guide to choosing the method that fits your lifestyle and needs.',
      date: new Date(),
    },
    {
      id: '2',
      title: 'STI Myths vs Facts',
      excerpt: 'We bust common myths and share facts to help you stay informed and safe.',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    {
      id: '3',
      title: 'Healthy Relationships 101',
      excerpt: 'Learn the basics of communication, respect, and consent in relationships.',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    },
  ]

  return (
    <section className="mt-12 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.03),_transparent_60%)] px-4 py-12 md:px-8 font-friendly">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2">Latest Resources</h2>
            <p className="text-lg md:text-xl text-slate-700 font-semibold">Fresh articles and guides created by our team.</p>
          </div>
          <Link to="/resources" className="hidden md:inline-flex items-center rounded-md bg-[#65A3FA] px-4 py-2 text-white font-semibold hover:bg-[#3B82F6]">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {resources.map((r) => (
            <article key={r.id} className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg transition-shadow hover:shadow-2xl h-full flex flex-col">
              <div className="p-6 sm:p-7 flex flex-col flex-1">
                <div className="mb-3 text-sm text-slate-500 font-semibold">
                  {r.date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900">{r.title}</h3>
                <p className="mt-2 text-base md:text-lg text-slate-700 font-medium flex-1">{r.excerpt}</p>
                <div className="mt-4">
                  <Link to={`/resources/${r.id}`} className="inline-flex items-center gap-1 text-base font-semibold text-[#65A3FA] hover:text-[#3B82F6]">
                    Read more <FiArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 md:hidden text-center">
          <Link to="/resources" className="inline-flex items-center rounded-md bg-[#65A3FA] px-4 py-2 text-white font-semibold hover:bg-[#3B82F6]">
            View all resources
          </Link>
        </div>
      </div>
    </section>
  )
}

export default LatestResourcesSection
