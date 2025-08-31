import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { api } from '../../api.js'
import FPOPLogo from '../../assets/FPOP.png'

export default function VerifyEmail() {
  const navigate = useNavigate()
  const location = useLocation()
  const [status, setStatus] = useState('Enter the 6‑digit code we emailed you.')
  const [error, setError] = useState('')
  const [errorStatus, setErrorStatus] = useState(null)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [success, setSuccess] = useState(false)
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    setError('')
  }, [email, code])

  // Prefill email from query parameter or localStorage if present
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search)
      const fromQuery = params.get('email') || ''
      const fromStorage = localStorage.getItem('pb:verifyEmailEmail') || ''
      const prefill = fromQuery || fromStorage
      if (prefill && !email) setEmail(prefill)
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search])

  // When verification succeeds, start a 5-second countdown then redirect
  useEffect(() => {
    if (!success) return
    setCountdown(5)
    const intervalId = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId)
          navigate('/login', { replace: true })
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalId)
  }, [success, navigate])

  async function handleVerify(e) {
    e.preventDefault()
    setStatus('Verifying…')
    setVerifying(true)
    try {
      const data = await api.post('/api/auth/verify-email', { email, code })
      const msg = (data && data.message) ? data.message : 'Email verified'
      setError('')
      setErrorStatus(null)
      setSuccess(true)
      setStatus(`${msg}. Redirecting…`)
      try { localStorage.removeItem('pb:verifyEmailEmail') } catch {}
    } catch (err) {
      const msg = err?.message || 'Verification failed'
      setErrorStatus(err?.status || null)
      setError(msg)
      setStatus(msg)
    } finally {
      setVerifying(false)
    }
  }

  

  return (
    <section className="px-4 md:px-8 py-8 md:py-12 font-friendly">
      <div className="mx-auto max-w-md text-center">
        <img src={FPOPLogo} alt="FPOP" className="mx-auto h-16 w-auto object-contain" />
        <h1 className="mt-3 text-2xl md:text-3xl font-extrabold">Verify email</h1>
        <p className="mt-2 text-slate-700 font-semibold" aria-live="polite" role="status">{status}</p>
        <div className="mt-6 text-left">
          {success ? (
            <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-6 text-center">
              <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-extrabold text-emerald-800">Email verified</h2>
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
            <form onSubmit={handleVerify} className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-4 md:p-6 space-y-4">
              <p className="text-sm text-slate-700 font-semibold">Enter the 6‑digit code</p>
              <div className="text-sm text-slate-600">{email ? `Verifying for ${email}` : 'Email not found. Go back to register.'}</div>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-bold text-slate-700">Verification code</span>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-slate-800 tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-[#65A3FA]"
                  placeholder="123456"
                  autoFocus
                  autoComplete="one-time-code"
                  required
                />
              </label>
              {error && (
                <div className={`rounded-md border px-3 py-2 text-sm font-semibold ${errorStatus === 429 ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-rose-200 bg-rose-50 text-rose-700'}`}>{error}</div>
              )}
              <button
                type="submit"
                disabled={verifying}
                className="w-full inline-flex items-center justify-center rounded-md bg-[#65A3FA] px-4 py-2.5 text-white font-semibold hover:bg-[#3B82F6] disabled:opacity-50"
              >
                {verifying ? 'Verifying…' : 'Verify email'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}


