import { Link } from 'react-router-dom'

export default function LoginRequired() {
  return (
    <div className="fixed inset-0 z-50 font-friendly" role="dialog" aria-modal="true">
      {/* Branded background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200" />
      <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#65A3FA]/30 blur-2xl" />
      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#3B82F6]/20 blur-2xl" />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 flex min-h-full items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-6 md:p-8 text-center">
          <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-[#65A3FA] text-white flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c.828 0 1.5-.672 1.5-1.5S12.828 8 12 8s-1.5.672-1.5 1.5S11.172 11 12 11z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13v5" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21c4.971 0 9-4.029 9-9s-4.029-9-9-9-9 4.029-9 9 4.029 9 9 9z" />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Sign in required</h2>
          <p className="mt-1 text-sm font-semibold text-slate-700">Please sign in to access this feature.</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <Link to="/login" className="inline-flex items-center justify-center rounded-md bg-[#65A3FA] px-4 py-2.5 text-white font-semibold hover:bg-[#3B82F6]">Sign in</Link>
            <Link to="/register" className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2.5 text-slate-800 font-semibold hover:bg-slate-100">Create account</Link>
            <Link to="/" className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2.5 text-slate-800 font-semibold hover:bg-slate-100">Go to home</Link>
          </div>
        </div>
      </div>
    </div>
  )
}



