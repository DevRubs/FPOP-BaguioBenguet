import { useState } from 'react'
import { FiHeart, FiBook, FiUsers, FiUser, FiPhone, FiMail } from 'react-icons/fi'

export default function VolunteerSignup() {
	const [form, setForm] = useState({
		name: '',
		email: '',
		phone: '',
		interests: '',
		notes: '',
	})
	const [submitting, setSubmitting] = useState(false)

	const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

	const handleSubmit = async (e) => {
		e.preventDefault()
		if (!form.name || !form.email || !form.phone) return
		setSubmitting(true)
		await new Promise((r) => setTimeout(r, 600))
		setSubmitting(false)
		setForm({ name: '', email: '', phone: '', interests: '', notes: '' })
		alert('Thanks for signing up! We\'ll be in touch.')
	}

	return (
		<section className="px-4 md:px-8 py-8 md:py-12 font-friendly">
			<div className="mx-auto max-w-5xl">
				<header className="mb-6 md:mb-8">
					<h1 className="text-3xl md:text-4xl font-extrabold">Volunteer Sign Up</h1>
				</header>

				{/* Information card */}
				<div className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-4 md:p-5 mb-6">
					<div className="grid grid-cols-1 gap-6">
						<InfoRow Icon={FiHeart} title="Make an Impact" titleClass="text-rose-600" desc="Help us create positive change in sexual health education and awareness in your community." />
						<InfoRow Icon={FiBook} title="Learn & Grow" titleClass="text-blue-600" desc="Gain valuable experience and knowledge in healthcare and community service." />
						<InfoRow Icon={FiUsers} title="Build Community" titleClass="text-purple-600" desc="Connect with like-minded individuals and make lasting relationships." />
					</div>
				</div>

				<form onSubmit={handleSubmit} className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-4 md:p-6 space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<label className="flex flex-col gap-1">
							<span className="text-sm font-bold text-slate-700">Full name</span>
							<div className="relative">
								<FiUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
								<input value={form.name} onChange={update('name')} required className="w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#65A3FA]" placeholder="Your name" />
							</div>
						</label>
						<label className="flex flex-col gap-1">
							<span className="text-sm font-bold text-slate-700">Email</span>
							<div className="relative">
								<FiMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
								<input type="email" value={form.email} onChange={update('email')} required className="w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#65A3FA]" placeholder="you@example.com" />
							</div>
						</label>
						<label className="flex flex-col gap-1">
							<span className="text-sm font-bold text-slate-700">Phone</span>
							<div className="relative">
								<FiPhone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
								<input value={form.phone} onChange={update('phone')} required className="w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#65A3FA]" placeholder="09xx xxx xxxx" />
							</div>
						</label>
						<label className="flex flex-col gap-1">
							<span className="text-sm font-bold text-slate-700">Interests</span>
							<input value={form.interests} onChange={update('interests')} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#65A3FA]" placeholder="Education, outreach, logistics, etc." />
						</label>
					</div>

					<label className="flex flex-col gap-1">
						<span className="text-sm font-bold text-slate-700">Notes (optional)</span>
						<textarea value={form.notes} onChange={update('notes')} rows={4} className="w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#65A3FA]" placeholder="Tell us more about yourself and availability." />
					</label>

					<div className="flex items-center justify-end gap-3 pt-2">
						<button type="reset" className="rounded-md border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50" onClick={() => setForm({ name: '', email: '', phone: '', interests: '', notes: '' })}>Clear</button>
						<button disabled={submitting} type="submit" className="inline-flex items-center gap-2 rounded-md bg-[#65A3FA] px-4 py-2 text-white font-semibold hover:bg-[#3B82F6] disabled:opacity-50">
							{submitting ? 'Submitting…' : 'Submit application'}
						</button>
					</div>
				</form>
			</div>
		</section>
	)
}

function InfoRow({ Icon, title, desc, titleClass }) {
	return (
		<div className="flex items-start gap-3">
			<div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
				<Icon />
			</div>
			<div className="min-w-0">
				<div className={`text-lg md:text-xl font-extrabold ${titleClass}`}>{title}</div>
				<p className="mt-1 text-sm md:text-base text-slate-600 font-semibold">{desc}</p>
			</div>
		</div>
	)
}

