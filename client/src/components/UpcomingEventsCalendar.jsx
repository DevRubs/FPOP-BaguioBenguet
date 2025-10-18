import { useState } from 'react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

function UpcomingEventsCalendar() {
  const [monthOffset, setMonthOffset] = useState(0)
  const today = new Date()
  const viewDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1)
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const startWeekday = firstDayOfMonth.getDay() // 0-6, Sun-Sat
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

  const leadingDays = startWeekday
  const totalCells = 42 // 6 weeks x 7 days to avoid layout shift
  const cells = []
  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - leadingDays + 1
    let cellDate
    let isCurrentMonth = true
    if (dayNumber < 1) {
      cellDate = new Date(year, month - 1, daysInPrevMonth + dayNumber)
      isCurrentMonth = false
    } else if (dayNumber > daysInMonth) {
      cellDate = new Date(year, month + 1, dayNumber - daysInMonth)
      isCurrentMonth = false
    } else {
      cellDate = new Date(year, month, dayNumber)
    }
    const key = cellDate.toISOString().slice(0, 10)
    cells.push({ date: cellDate, isCurrentMonth, key })
  }

  const events = [
    { id: 1, title: 'Free HIV Testing', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2), location: 'FPOP Clinic' },
    { id: 2, title: 'Youth Health Seminar', date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6), location: 'Community Hall' },
    { id: 3, title: 'Family Planning Workshop', date: new Date(today.getFullYear(), today.getMonth() + 1, 3), location: 'Barangay Center' },
  ]
  const eventMap = events.reduce((acc, ev) => {
    const k = ev.date.toISOString().slice(0, 10)
    if (!acc[k]) acc[k] = []
    acc[k].push(ev)
    return acc
  }, {})

  const monthLabel = viewDate.toLocaleString(undefined, { month: 'long', year: 'numeric' })
  const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <section className="mt-12 bg-gradient-to-br from-slate-50 to-white px-4 py-12 md:px-8 font-friendly">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-2">Upcoming Events</h2>
          <p className="text-lg md:text-xl text-slate-700 font-semibold">See what's happening soon and plan your visit.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
          <div className="lg:col-span-2 rounded-2xl border border-[#65A3FA] bg-white shadow-lg transition-shadow hover:shadow-2xl">
            <div className="flex items-center justify-between p-4 md:p-6">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50"
                onClick={() => setMonthOffset((v) => v - 1)}
                aria-label="Previous month"
              >
                <FiChevronLeft size={18} />
              </button>
              <div className="text-xl md:text-2xl font-bold text-slate-800">{monthLabel}</div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-700 hover:bg-slate-50"
                onClick={() => setMonthOffset((v) => v + 1)}
                aria-label="Next month"
              >
                <FiChevronRight size={18} />
              </button>
            </div>

            <div className="px-3 md:px-6 pb-4">
              <div className="grid grid-cols-7 text-center text-xs md:text-sm font-semibold text-slate-600">
                {weekdayLabels.map((d) => (
                  <div key={d} className="py-2">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-px rounded-xl bg-slate-200">
                {cells.map(({ date, isCurrentMonth, key }) => {
                  const isToday = date.toDateString() === today.toDateString()
                  const k = key
                  const hasEvents = !!eventMap[k]
                  return (
                    <div key={k} className="bg-white">
                      <div className={`relative h-20 md:h-24 p-2 ${isCurrentMonth ? '' : 'text-slate-300'} ${isToday ? 'ring-2 ring-[#65A3FA]' : ''}`}>
                        <div className="text-right text-xs md:text-sm font-semibold text-slate-700">
                          {date.getDate()}
                        </div>
                        {hasEvents && (
                          <div className="absolute left-2 bottom-2 right-2 space-y-1">
                            {eventMap[k].slice(0, 2).map((ev) => (
                              <div key={ev.id} className="truncate rounded-md bg-[#65A3FA]/10 px-2 py-0.5 text-[10px] md:text-xs text-[#1E3A8A]">
                                {ev.title}
                              </div>
                            ))}
                            {eventMap[k].length > 2 && (
                              <div className="text-[10px] md:text-xs text-slate-500">+{eventMap[k].length - 2} more</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg transition-shadow hover:shadow-2xl p-4 md:p-6">
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-3">This Month</h3>
            <ul className="space-y-3">
              {events
                .filter((ev) => ev.date.getMonth() === month && ev.date.getFullYear() === year)
                .sort((a, b) => a.date - b.date)
                .map((ev) => (
                  <li key={ev.id} className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-col items-center justify-center rounded-md bg-[#65A3FA]/10 text-[#1E3A8A]">
                      <div className="text-xs font-semibold uppercase">{ev.date.toLocaleString(undefined, { month: 'short' })}</div>
                      <div className="text-base font-bold">{ev.date.getDate()}</div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-base font-semibold text-slate-800 truncate">{ev.title}</div>
                      <div className="text-sm text-slate-600 truncate">{ev.location}</div>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UpcomingEventsCalendar
