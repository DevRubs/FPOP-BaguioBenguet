import { useParams, Link } from 'react-router-dom'

export default function ArticleView() {
  const { id } = useParams()
  const article = {
    id,
    title: `Article ${id}`,
    author: 'FPOP Team',
    date: new Date(),
    tag: 'General Health',
    content: `This is a placeholder for article ${id}. Replace this with your real content or fetched data.`,
  }

  return (
    <article className="px-4 md:px-8 py-8 md:py-12 font-friendly">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6">
          <div className="mb-3 flex items-center gap-3 text-xs font-semibold text-slate-500">
            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[#1E3A8A]">{article.tag}</span>
            <span>{article.date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{article.title}</h1>
          <div className="mt-2 text-slate-600 font-semibold">By {article.author}</div>
        </header>

        <div className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg transition-shadow hover:shadow-2xl p-5 md:p-6">
          <p className="text-base md:text-lg text-slate-800 leading-relaxed">
            {article.content}
          </p>
        </div>

        <div className="mt-6">
          <Link to="/resources" className="inline-flex items-center rounded-md bg-[#65A3FA] px-4 py-2 text-white font-semibold hover:bg-[#3B82F6]">Back to resources</Link>
        </div>
      </div>
    </article>
  )
}


