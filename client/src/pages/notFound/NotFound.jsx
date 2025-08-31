import { Link, useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <p className="text-sm font-semibold text-blue-600">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Page not found</h1>
      <p className="mt-2 text-base text-slate-600">Sorry, we couldn’t find the page you’re looking for.</p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Go back
        </button>
        <Link
          to="/"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Take me home
        </Link>
      </div>
    </div>
  )
}



