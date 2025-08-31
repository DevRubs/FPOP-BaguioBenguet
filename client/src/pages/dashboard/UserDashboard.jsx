import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { FiUser, FiMail, FiShield, FiCalendar, FiEdit2, FiSave, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

export default function UserDashboard() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [saving, setSaving] = useState(false)
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' })
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' })

  const handleSave = async () => {
    setSaving(true)
    await Promise.resolve(updateUser({ name, email }))
    setSaving(false)
  }

  return (
    <section className="px-4 md:px-8 py-8 md:py-12 font-friendly">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">Your Profile</h1>
          <p className="text-lg md:text-xl text-slate-700 font-semibold">Manage your account information and view your status.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-6 md:gap-8">
          {/* Profile editor */}
          <div className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-4 md:p-6">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#1E3A8A]">
                <FiUser size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-xl md:text-2xl font-extrabold">Account Details</h2>
                <p className="text-slate-600 font-semibold">Update your personal information below.</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-sm font-bold text-slate-700">Full name</span>
                <div className="relative">
                  <FiUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#65A3FA]" placeholder="Your name" />
                </div>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-sm font-bold text-slate-700">Email</span>
                <div className="relative">
                  <FiMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#65A3FA]" placeholder="you@example.com" />
                </div>
              </label>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                className="inline-flex items-center gap-2 rounded-md bg-[#65A3FA] px-4 py-2 text-white font-semibold hover:bg-[#3B82F6] disabled:opacity-50"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? <FiSave /> : <FiEdit2 />} {saving ? 'Saving…' : 'Save changes'}
              </button>
              <span className="text-slate-600 text-sm font-semibold">Role: <span className="text-[#1E3A8A] font-bold">{user?.role ?? 'user'}</span></span>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-extrabold text-[#1E3A8A] mb-3">Account Status</h2>
            <div className="space-y-3 text-sm font-semibold text-slate-700">
              <div className="flex items-center gap-2"><FiShield /> Verified account</div>
              <div className="flex items-center gap-2"><FiCalendar /> Member since {new Date().getFullYear()}</div>
            </div>
            <hr className="my-4" />
            <h3 className="text-sm font-bold text-slate-700 mb-2">Tips</h3>
            <ul className="list-disc pl-5 text-sm text-slate-600 font-semibold space-y-1">
              <li>Keep your contact info up to date.</li>
              <li>Use the chat for quick questions.</li>
              <li>Book appointments from the Schedule menu.</li>
            </ul>
          </aside>
        </div>

        {/* Change password */}
        <div className="mt-6 rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-4 md:p-6">
          <div className="flex items-start gap-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-[#1E3A8A]">
              <FiLock size={24} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl md:text-2xl font-extrabold">Change Password</h2>
              <p className="text-slate-600 font-semibold">Use a strong password with at least 8 characters.</p>
            </div>
          </div>

          {pwMsg.text && (
            <div className={`mt-4 rounded-md border px-3 py-2 text-sm font-semibold ${pwMsg.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-rose-200 bg-rose-50 text-rose-800'}`}>
              {pwMsg.text}
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <PasswordField
              label="Current password"
              value={pw.current}
              onChange={(v) => setPw((p) => ({ ...p, current: v }))}
              shown={showPw.current}
              onToggle={() => setShowPw((s) => ({ ...s, current: !s.current }))}
            />
            <PasswordField
              label="New password"
              value={pw.next}
              onChange={(v) => setPw((p) => ({ ...p, next: v }))}
              shown={showPw.next}
              onToggle={() => setShowPw((s) => ({ ...s, next: !s.next }))}
            />
            <PasswordField
              label="Confirm new password"
              value={pw.confirm}
              onChange={(v) => setPw((p) => ({ ...p, confirm: v }))}
              shown={showPw.confirm}
              onToggle={() => setShowPw((s) => ({ ...s, confirm: !s.confirm }))}
            />
          </div>

          <div className="mt-5">
            <button
              className="inline-flex items-center gap-2 rounded-md bg-[#65A3FA] px-4 py-2 text-white font-semibold hover:bg-[#3B82F6] disabled:opacity-50"
              onClick={async () => {
                setPwMsg({ type: '', text: '' })
                if (!pw.current || !pw.next || !pw.confirm) {
                  setPwMsg({ type: 'error', text: 'Please fill in all password fields.' })
                  return
                }
                if (pw.next.length < 8) {
                  setPwMsg({ type: 'error', text: 'New password must be at least 8 characters.' })
                  return
                }
                if (pw.next !== pw.confirm) {
                  setPwMsg({ type: 'error', text: 'New password and confirmation do not match.' })
                  return
                }
                setPwSaving(true)
                // TODO: call backend endpoint to change password
                await new Promise((r) => setTimeout(r, 700))
                setPwSaving(false)
                setPw({ current: '', next: '', confirm: '' })
                setPwMsg({ type: 'success', text: 'Password updated successfully.' })
              }}
              disabled={pwSaving}
            >
              {pwSaving ? <FiSave /> : <FiLock />} {pwSaving ? 'Saving…' : 'Update password'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function PasswordField({ label, value, onChange, shown, onToggle }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <div className="relative">
        <input
          type={shown ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-slate-300 bg-white pr-10 pl-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#65A3FA]"
        />
        <button type="button" onClick={onToggle} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700">
          {shown ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
    </label>
  )
}


