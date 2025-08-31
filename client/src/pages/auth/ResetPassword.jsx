import { useState, useEffect } from 'react'
import FPOPLogo from '../../assets/FPOP.png'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../../api.js'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const t = searchParams.get('token')
    if (t) setToken(t)
  }, [searchParams])

  // On success, start countdown and redirect to sign in
  useEffect(() => {
    if (!success) return
    setCountdown(5)
    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(id)
          navigate('/login', { replace: true })
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [success, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    if (!token || !password) return
    setSubmitting(true)
    try {
      await api.post('/api/auth/reset-password', { token, password })
      setSuccess(true)
    } catch (err) {
      setMessage(err?.message || 'Failed to reset password')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="px-4 md:px-8 py-8 md:py-12 font-friendly">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-6">
          <img src={FPOPLogo} alt="FPOP" className="mx-auto h-16 w-auto object-contain" />
          <h1 className="mt-3 text-2xl md:text-3xl font-extrabold">Reset password</h1>
          <p className="text-slate-600 font-semibold">Enter your code and new password</p>
        </div>
        {success ? (
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-center">
            <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-extrabold text-emerald-800">Password updated</h2>
            <p className="mt-1 text-sm font-semibold text-emerald-700">Redirecting to sign in in {countdown}s…</p>
            <button
              type="button"
              onClick={() => navigate('/login', { replace: true })}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2.5 text-white font-semibold hover:bg-emerald-700"
            >
              Go to sign in
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-4 md:p-6 space-y-4">
            {!token && (
              <label className="flex flex-col gap-1">
                <span className="text-sm font-bold text-slate-700">Reset token</span>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#65A3FA]"
                  placeholder="Paste token from email link"
                  required
                />
              </label>
            )}
            <label className="flex flex-col gap-1">
              <span className="text-sm font-bold text-slate-700">New password</span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 pr-10 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#65A3FA]"
                  placeholder="••••••••"
                  required
                  minLength={6}
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
            {message && (
              <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 font-semibold">{message}</div>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center rounded-md bg-[#65A3FA] px-4 py-2.5 text-white font-semibold hover:bg-[#3B82F6] disabled:opacity-50"
            >
              {submitting ? 'Saving…' : 'Reset password'}
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
