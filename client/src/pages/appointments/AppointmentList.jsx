import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus, FiCalendar, FiClock, FiMapPin, FiChevronRight, FiSearch } from 'react-icons/fi'

export default function AppointmentList() {
	const [query, setQuery] = useState('')
	const [status, setStatus] = useState('all') // all | upcoming | completed | cancelled
	const [type, setType] = useState('all') // all | counseling | checkup | followup

	const UNIVERSAL_LOCATION = "Room 517, Regus Co., 5th Floor, Abanao Square Mall, Baguio City"

	// Demo data
	const appointments = [
		{ id: '1', title: 'General Counseling', type: 'counseling', date: '2025-09-05', time: '10:00 AM', location: UNIVERSAL_LOCATION, status: 'upcoming' },
		{ id: '2', title: 'SRH Check-up', type: 'checkup', date: '2025-08-15', time: '02:30 PM', location: UNIVERSAL_LOCATION, status: 'completed' },
		{ id: '3', title: 'Follow-up Session', type: 'followup', date: '2025-08-01', time: '09:00 AM', location: UNIVERSAL_LOCATION, status: 'cancelled' },
	]

	const filtered = useMemo(() => {
		const text = query.trim().toLowerCase()
		return appointments.filter((a) => {
			const textOk = !text || a.title.toLowerCase().includes(text) || a.type.toLowerCase().includes(text)
			const statusOk = status === 'all' || a.status === status
			const typeOk = type === 'all' || a.type === type
			return textOk && statusOk && typeOk
		})
	}, [appointments, query, status, type])

	return (
		<section className="px-4 md:px-8 py-8 md:py-12 font-friendly">
			<div className="mx-auto max-w-6xl">
				<header className="mb-6 md:mb-8 flex items-center justify-between gap-3">
					<div>
						<h1 className="text-3xl md:text-4xl font-extrabold mb-1">Appointments</h1>
						<p className="text-lg md:text-xl text-slate-700 font-semibold">View, filter, and book your sessions.</p>
					</div>
					<Link to="/appointments/new" className="inline-flex items-center gap-2 rounded-md bg-[#65A3FA] px-4 py-2 text-white font-semibold hover:bg-[#3B82F6]">
						<FiPlus /> Book appointment
					</Link>
				</header>

				{/* Controls */}
				<div className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-4 md:p-6 mb-8">
					<div className="flex flex-col md:flex-row gap-4 md:items-center">
						<div className="relative flex-1 min-w-[220px]">
							<FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
							<input
								type="text"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search by title or type…"
								className="w-full rounded-md border border-slate-300 bg-white px-10 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#65A3FA]"
							/>
						</div>
						<div className="flex items-center gap-3">
							<select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#65A3FA]">
								<option value="all">All statuses</option>
								<option value="upcoming">Upcoming</option>
								<option value="completed">Completed</option>
								<option value="cancelled">Cancelled</option>
							</select>
							<select value={type} onChange={(e) => setType(e.target.value)} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#65A3FA]">
								<option value="all">All types</option>
								<option value="counseling">Counseling</option>
								<option value="checkup">SRH Check-up</option>
								<option value="followup">Follow-up</option>
							</select>
						</div>
					</div>
				</div>

				{/* List */}
				<div className="grid grid-cols-1 gap-4">
					{filtered.length === 0 && (
						<div className="rounded-xl border-2 border-dashed border-slate-300 p-6 text-center text-slate-600 font-semibold">
							No appointments found.
						</div>
					)}
					{filtered.map((a) => (
						<AppointmentCard key={a.id} appt={a} />
					))}
				</div>
			</div>
		</section>
	)
}

function statusStyle(status) {
	switch (status) {
		case 'upcoming':
			return 'text-emerald-700 bg-emerald-50 border-emerald-200'
		case 'completed':
			return 'text-slate-700 bg-slate-100 border-slate-300'
		case 'cancelled':
			return 'text-rose-700 bg-rose-50 border-rose-200'
		default:
			return 'text-slate-700 bg-slate-100 border-slate-300'
	}
}

function AppointmentCard({ appt }) {
	return (
		<article className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-4 md:p-5">
			<div className="flex items-start justify-between gap-4">
				<div className="min-w-0">
					<h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">{appt.title}</h3>
					<div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-slate-600">
						<span className="inline-flex items-center gap-1"><FiCalendar /> {new Date(appt.date).toLocaleDateString()}</span>
						<span className="inline-flex items-center gap-1"><FiClock /> {appt.time}</span>
						<span className="inline-flex items-center gap-1"><FiMapPin /> {appt.location}</span>
						<span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${statusStyle(appt.status)}`}>{appt.status}</span>
					</div>
				</div>
				<div className="flex items-center gap-2 shrink-0">
					<Link to={`/appointments/${appt.id}`} className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50">
						Details <FiChevronRight />
					</Link>
					<button className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50">Reschedule</button>
					<button className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700 hover:bg-rose-100">Cancel</button>
				</div>
			</div>
		</article>
	)
}

function ServiceCard({ to, Icon, title, desc, titleClass }) {
	return (
		<Link to={to} className="group rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-4 md:p-5 hover:shadow-xl transition-shadow">
			<div className="flex items-start gap-3">
				<div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
					<Icon />
				</div>
				<div className="min-w-0">
					<div className={`text-lg md:text-xl font-extrabold ${titleClass}`}>{title}</div>
					<p className="mt-1 text-sm md:text-base text-slate-600 font-semibold">{desc}</p>
				</div>
				<FiChevronRight className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
			</div>
		</Link>
	)
}

