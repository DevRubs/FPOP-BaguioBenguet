import { useAuth } from '../../context/AuthContext.jsx'
import { useNavigate, Link } from 'react-router-dom'
import FPOPLogo from '../../assets/FPOP.png'
import { useEffect, useState } from 'react'

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [errorStatus, setErrorStatus] = useState(null)

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true })
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setErrorStatus(null)
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setSubmitting(true)
    try {
      await login({ email, password })
      navigate('/', { replace: true })
    } catch (err) {
      // Redirect to verify email if backend indicates verification is required
      if (err?.status === 403 && (err?.data?.verifyRequired || /Email not verified/i.test(err?.message || ''))) {
        navigate(`/verify-email?email=${encodeURIComponent(email)}`, { replace: true })
        return
      }
      setErrorStatus(err?.status || null)
      setError(err?.message || 'Sign-in failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="px-4 md:px-8 py-8 md:py-12 font-friendly">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-6">
          <img src={FPOPLogo} alt="FPOP" className="mx-auto h-16 w-auto object-contain" />
          <h1 className="mt-3 text-2xl md:text-3xl font-extrabold">Sign in</h1>
          <p className="text-slate-600 font-semibold">Welcome back</p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-4 md:p-6 space-y-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-bold text-slate-700">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#65A3FA]"
              placeholder="you@example.com"
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm font-bold text-slate-700">Password</span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 pr-10 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#65A3FA]"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-500 hover:text-slate-700"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M13.875 18.825A10.05 10.05 0 0112 19.125c-5.523 0-10-4.477-10-10 0-1.08.17-2.118.486-3.09M21.514 6.035A9.956 9.956 0 0122 9.125c0 5.523-4.477 10-10 10-.675 0-1.335-.066-1.975-.193M3 3l18 18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </label>
          {error && (
            <div className={`rounded-md border px-3 py-2 text-sm font-semibold ${errorStatus === 429 ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>{error}</div>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center rounded-md bg-[#65A3FA] px-4 py-2.5 text-white font-semibold hover:bg-[#3B82F6] disabled:opacity-50"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
          <div className="flex items-center justify-start text-sm text-slate-600 font-semibold">
            <Link to="/forgot-password" className="text-[#1E3A8A] hover:underline">Forgot password?</Link>
          </div>
          <div className="text-center text-sm text-slate-600 font-semibold">
            Don t have an account? <Link to="/register" className="text-[#1E3A8A] hover:underline">Sign up</Link>
          </div>
        </form>
      </div>
    </section>
  )
}


