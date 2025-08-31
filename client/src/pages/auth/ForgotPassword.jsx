 import { useEffect, useState } from 'react'
import { api } from '../../api.js'
import FPOPLogo from '../../assets/FPOP.png'
import { useAuth } from '../../context/AuthContext.jsx'

export default function ForgotPassword() {
  const { isAuthenticated } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // If already authenticated, redirect to home
  useEffect(() => {
    if (isAuthenticated) window.location.replace('/')
  }, [isAuthenticated])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)
    try {
      await api.post('/api/auth/forgot-password', { email })
      setSent(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="px-4 md:px-8 py-8 md:py-12 font-friendly">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-6">
          <img src={FPOPLogo} alt="FPOP" className="mx-auto h-16 w-auto object-contain" />
          <h1 className="mt-3 text-2xl md:text-3xl font-extrabold">Forgot password</h1>
          <p className="text-slate-600 font-semibold">We'll email you a reset code</p>
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
          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center rounded-md bg-[#65A3FA] px-4 py-2.5 text-white font-semibold hover:bg-[#3B82F6] disabled:opacity-50"
          >
            {submitting ? 'Sending…' : 'Send reset code'}
          </button>
          {sent && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 font-semibold">
              If an account exists for {email}, a password reset link has been sent.
            </div>
          )}
        </form>
      </div>
    </section>
  )
}
