import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FiArrowLeft, FiCalendar, FiClock, FiMapPin, FiUser, FiPhone, FiChevronDown, FiActivity, FiUserCheck, FiUsers } from 'react-icons/fi'

export default function AppointmentForm() {
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()

	// Scheduling and location information (applied, not exposing raw config)
	const UNIVERSAL_LOCATION = "Room 517, Regus Co., 5th Floor, Abanao Square Mall, Baguio City"
	const DAY_SCHEDULE = {
		monday: { start: '10:00', end: '19:00' },
		tuesday: { start: '10:00', end: '19:00' },
		wednesday: { start: '10:00', end: '19:00' },
		thursday: { start: '10:00', end: '19:00' },
		friday: { start: '10:00', end: '19:00' },
		saturday: { start: '13:00', end: '19:00' },
	}
	const weekdayName = (date) => ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'][date.getDay()]
	const formatTime12 = (time24) => {
		if (!time24) return ''
		const [hh, mm] = time24.split(':')
		let h = parseInt(hh, 10)
		const ampm = h >= 12 ? 'PM' : 'AM'
		h = h % 12
		if (h === 0) h = 12
		return `${h}:${mm} ${ampm}`
	}
	const toMinutes = (time24) => {
		const [hh, mm] = time24.split(':').map(Number)
		return hh * 60 + mm
	}
	const fromMinutes = (mins) => {
		const h = Math.floor(mins / 60).toString().padStart(2, '0')
		const m = (mins % 60).toString().padStart(2, '0')
		return `${h}:${m}`
	}

	const [form, setForm] = useState({
		name: '',
		phone: '',
		date: '',
		time: '',
		location: UNIVERSAL_LOCATION,
		type: 'counseling',
		notes: '',
	})
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState('')

	// Preselect type via query param
	useEffect(() => {
		const t = searchParams.get('type')
		if (t && ['counseling', 'checkup', 'followup'].includes(t)) {
			setForm((f) => ({ ...f, type: t }))
		}
	}, [searchParams])

	const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

	// Derive schedule for selected date
	const selectedDaySchedule = useMemo(() => {
		if (!form.date) return null
		const d = new Date(form.date + 'T00:00:00')
		if (isNaN(d)) return null
		const day = weekdayName(d)
		if (day === 'sunday') return 'closed'
		return DAY_SCHEDULE[day] || null
	}, [form.date])

	// Generate available time slots (15-minute increments) for the selected day
	const timeSlots = useMemo(() => {
		if (!selectedDaySchedule || selectedDaySchedule === 'closed') return []
		const start = toMinutes(selectedDaySchedule.start)
		const end = toMinutes(selectedDaySchedule.end)
		const slots = []
		for (let t = start; t <= end; t += 15) {
			slots.push(fromMinutes(t))
		}
		return slots
	}, [selectedDaySchedule])

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError('')
		if (!form.name || !form.phone || !form.date || !form.time) return
		const d = new Date(form.date + 'T00:00:00')
		if (weekdayName(d) === 'sunday') {
			setError('Sundays are unavailable for appointments.')
			return
		}
		const sched = DAY_SCHEDULE[weekdayName(d)]
		if (sched && (form.time < sched.start || form.time > sched.end)) {
			setError(`Please choose a time between ${formatTime12(sched.start)} and ${formatTime12(sched.end)}.`)
			return
		}
		setSubmitting(true)
		// TODO: POST to backend
		await new Promise((r) => setTimeout(r, 600))
		setSubmitting(false)
		navigate('/appointments')
	}

	return (
		<section className="px-4 md:px-8 py-8 md:py-12 font-friendly">
			<div className="mx-auto max-w-5xl">
				<header className="mb-6 md:mb-8">
					<h1 className="text-3xl md:text-4xl font-extrabold">New Appointment</h1>
				</header>

				{/* Services info card (non-interactive) */}
				<div className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-4 md:p-5 mb-6">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
						<div className="flex items-start gap-3">
							<div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
								<FiActivity />
							</div>
							<div className="min-w-0">
								<div className="text-lg md:text-xl font-extrabold text-rose-600">HIV Testing</div>
								<p className="mt-1 text-sm md:text-base text-slate-600 font-semibold">Free HIV screening in a confidential setting.</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
								<FiUserCheck />
							</div>
							<div className="min-w-0">
								<div className="text-lg md:text-xl font-extrabold text-blue-600">Consultation</div>
								<p className="mt-1 text-sm md:text-base text-slate-600 font-semibold">Talk to a professional about your SRH concerns.</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
								<FiUsers />
							</div>
							<div className="min-w-0">
								<div className="text-lg md:text-xl font-extrabold text-emerald-600">Family Planning</div>
								<p className="mt-1 text-sm md:text-base text-slate-600 font-semibold">Comprehensive family planning services and counseling.</p>
							</div>
						</div>
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
							<span className="text-sm font-bold text-slate-700">Phone</span>
							<div className="relative">
								<FiPhone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
								<input value={form.phone} onChange={update('phone')} required className="w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#65A3FA]" placeholder="09xx xxx xxxx" />
							</div>
						</label>
						<label className="flex flex-col gap-1">
							<span className="text-sm font-bold text-slate-700">Date</span>
							<div className="relative">
								<FiCalendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
								<input
									type="date"
									value={form.date}
									onChange={(e) => {
										const v = e.target.value
										setForm((f) => ({ ...f, date: v }))
										setError('')
										if (v) {
											const d = new Date(v + 'T00:00:00')
											if (weekdayName(d) === 'sunday') {
												setError('Sundays are unavailable for appointments.')
												setForm((f) => ({ ...f, time: '' }))
											}
										}
									}}
									required
									className="w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#65A3FA]"
								/>
							</div>
						</label>
						<label className="flex flex-col gap-1">
							<span className="text-sm font-bold text-slate-700">Time</span>
							<div className="relative">
								<FiClock className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
								<select
									value={form.time}
									onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
									disabled={!selectedDaySchedule || selectedDaySchedule === 'closed'}
									required
									className="w-full appearance-none rounded-md border border-slate-300 bg-white pl-10 pr-8 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#65A3FA]"
								>
									{!form.date && <option value="">Select a date first</option>}
									{selectedDaySchedule === 'closed' && <option value="">Closed on Sundays</option>}
									{timeSlots.map((t) => (
										<option key={t} value={t}>{formatTime12(t)}</option>
									))}
								</select>
								<FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
								{form.date && (
									<div className="mt-1 pl-10 text-[11px] text-slate-500 font-semibold">
										{selectedDaySchedule === 'closed' && 'Closed on Sundays'}
										{selectedDaySchedule && selectedDaySchedule !== 'closed' && `Available ${formatTime12(selectedDaySchedule.start)}–${formatTime12(selectedDaySchedule.end)}`}
									</div>
								)}
							</div>
						</label>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<label className="flex flex-col gap-1">
							<span className="text-sm font-bold text-slate-700">Location</span>
							<div className="relative flex items-center gap-2 rounded-md border border-slate-300 bg-white pl-10 pr-3 py-2.5">
								<FiMapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
								<span className="text-slate-800 font-semibold">{UNIVERSAL_LOCATION}</span>
							</div>
						</label>
						<label className="flex flex-col gap-1">
							<span className="text-sm font-bold text-slate-700">Type</span>
							<select value={form.type} onChange={update('type')} className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#65A3FA]">
								<option value="counseling">Counseling</option>
								<option value="checkup">SRH Check-up</option>
								<option value="followup">Follow-up</option>
							</select>
						</label>
					</div>

					<label className="flex flex-col gap-1">
						<span className="text-sm font-bold text-slate-700">Notes (optional)</span>
						<textarea value={form.notes} onChange={update('notes')} rows={4} className="w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#65A3FA]" placeholder="Anything else you'd like to share?" />
					</label>

					{error && (
						<div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 font-semibold">
							{error}
						</div>
					)}

					<div className="flex items-center justify-end gap-3 pt-2">
						<Link to="/appointments" className="rounded-md border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-50">Cancel</Link>
						<button disabled={submitting} type="submit" className="inline-flex items-center gap-2 rounded-md bg-[#65A3FA] px-4 py-2 text-white font-semibold hover:bg-[#3B82F6] disabled:opacity-50">
							{submitting ? 'Submitting…' : 'Book appointment'}
						</button>
					</div>
				</form>
			</div>
		</section>
	)
}

// Removed interactive ServicePick; services are presented as a non-interactive info card above the form.

