import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { FiChevronLeft, FiChevronRight, FiBookOpen, FiMessageSquare, FiHeart, FiCalendar, FiUsers, FiShoppingBag, FiChevronRight as FiArrowRight } from 'react-icons/fi'
import CarouselPhoto1 from '../../assets/CarouselPhoto1.jpg'
import CarouselPhoto2 from '../../assets/CarouselPhoto2.jpg'
import CarouselPhoto5 from '../../assets/CarouselPhoto5.jpg'

function HeroCarousel({ slides, intervalMs = 5000 }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef(null)
  const touchStartXRef = useRef(null)
  const touchEndXRef = useRef(null)

  const go = (next) => {
    setIndex((i) => (i + next + slides.length) % slides.length)
  }

  useEffect(() => {
    if (paused || slides.length <= 1) return
    timerRef.current = setInterval(() => go(1), intervalMs)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [paused, intervalMs, slides.length])

  function onTouchStart(e) {
    touchStartXRef.current = e.touches[0].clientX
    touchEndXRef.current = null
  }
  function onTouchMove(e) {
    touchEndXRef.current = e.touches[0].clientX
  }
  function onTouchEnd() {
    if (touchStartXRef.current == null || touchEndXRef.current == null) return
    const delta = touchEndXRef.current - touchStartXRef.current
    const threshold = 50
    if (Math.abs(delta) > threshold) {
      go(delta > 0 ? -1 : 1)
    }
    touchStartXRef.current = null
    touchEndXRef.current = null
  }

  return (
    <section
      className="relative -mt-6 mb-6 w-screen mx-[calc(50%-50vw)] bg-white overflow-hidden"
      aria-label="Featured content carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className="h-64 sm:h-80 md:h-[24rem] lg:h-[28rem] xl:h-[32rem] w-full overflow-hidden">
        <div
          className="flex h-full w-full transition-transform duration-500"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={slide.id}
              className="relative h-full w-full shrink-0 grow-0 basis-full"
              aria-hidden={i !== index}
            >
              {slide.image ? (
                <img src={slide.image} alt={slide.alt ?? ''} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-slate-100" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Dark overlay for readability */}
      <div className="pointer-events-none absolute inset-0 bg-black/40" />

      {/* Centered headline and CTAs (dynamic per slide) */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="pointer-events-auto text-center max-w-3xl">
          <h1 className="text-white font-extrabold tracking-tight drop-shadow text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {slides[index]?.headline ?? 'Promoting Sexual Health and Wellness'}
          </h1>
          <p className="mt-3 text-white/90 drop-shadow text-sm sm:text-base md:text-lg">
            {slides[index]?.subtext ?? 'Comprehensive education and resources for better health understanding.'}
          </p>
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-2">
            <Link to="/resources" className="inline-flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-slate-900 px-4 py-2 sm:px-5 sm:py-2 text-sm sm:text-base font-semibold shadow w-full sm:w-auto">
              Explore Resources
            </Link>
            <Link to="/appointments" className="inline-flex items-center justify-center rounded-full border border-white/90 text-white hover:bg-white/10 px-4 py-2 sm:px-5 sm:py-2 text-sm sm:text-base font-semibold w-full sm:w-auto">
              Book Appointment
            </Link>
          </div>
        </div>
      </div>

      {/* Controls removed (swipe and auto-rotate remain) */}

      {/* Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={index === i}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${index === i ? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function ServiceCard({ icon: Icon, title, description, to = '#', className = '' }) {
  return (
    <div className={`group rounded-2xl bg-white text-slate-800 border border-[#65A3FA] shadow-lg transition-shadow hover:shadow-2xl h-full ${className}`}>
      <div className="p-6 sm:p-7 flex flex-col h-full">
        <div className="mx-auto mb-4 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#65A3FA]/10 text-[#65A3FA] shadow-[0_0_0_6px_rgba(101,163,250,0.08)]">
          <Icon size={22} />
        </div>
        <h3 className="text-center text-lg sm:text-xl font-bold">{title}</h3>
        <p className="mt-2 text-center text-base sm:text-lg text-slate-700 font-medium flex-1">{description}</p>
        <div className="mt-4 text-center">
          <Link to={to} className="inline-flex items-center gap-1 text-base font-semibold text-[#65A3FA] hover:text-[#3B82F6]">
            Learn more <FiArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}

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

function LatestResourcesSection() {
  const resources = [
    {
      id: '1',
      title: 'Understanding Contraceptive Options',
      excerpt: 'A friendly guide to choosing the method that fits your lifestyle and needs.',
      date: new Date(),
    },
    {
      id: '2',
      title: 'STI Myths vs Facts',
      excerpt: 'We bust common myths and share facts to help you stay informed and safe.',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    },
    {
      id: '3',
      title: 'Healthy Relationships 101',
      excerpt: 'Learn the basics of communication, respect, and consent in relationships.',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    },
  ]

  return (
    <section className="mt-12 bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0.03),_transparent_60%)] px-4 py-12 md:px-8 font-friendly">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2">Latest Resources</h2>
            <p className="text-lg md:text-xl text-slate-700 font-semibold">Fresh articles and guides created by our team.</p>
          </div>
          <Link to="/resources" className="hidden md:inline-flex items-center rounded-md bg-[#65A3FA] px-4 py-2 text-white font-semibold hover:bg-[#3B82F6]">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {resources.map((r) => (
            <article key={r.id} className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg transition-shadow hover:shadow-2xl h-full flex flex-col">
              <div className="p-6 sm:p-7 flex flex-col flex-1">
                <div className="mb-3 text-sm text-slate-500 font-semibold">
                  {r.date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900">{r.title}</h3>
                <p className="mt-2 text-base md:text-lg text-slate-700 font-medium flex-1">{r.excerpt}</p>
                <div className="mt-4">
                  <Link to={`/resources/${r.id}`} className="inline-flex items-center gap-1 text-base font-semibold text-[#65A3FA] hover:text-[#3B82F6]">
                    Read more <FiArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 md:hidden text-center">
          <Link to="/resources" className="inline-flex items-center rounded-md bg-[#65A3FA] px-4 py-2 text-white font-semibold hover:bg-[#3B82F6]">
            View all resources
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function Homepage() {
  return (
    <div>
      <HeroCarousel
        slides={[
          {
            id: 1,
            image: CarouselPhoto1,
            alt: 'Carousel photo 1',
            headline: 'Promoting Sexual Health and Wellness',
            subtext: 'Comprehensive education and resources for better health understanding.'
          },
          {
            id: 2,
            image: CarouselPhoto2,
            alt: 'Carousel photo 2',
            headline: 'Expert-Led Information',
            subtext: 'Evidence-based guidance from healthcare professionals.'
          },
          {
            id: 3,
            image: CarouselPhoto5,
            alt: 'Carousel photo 3',
            headline: 'Confidential Support',
            subtext: 'Safe and private access to essential health information.'
          },
        ]}
      />


      {/* Services section */}
      <section className="mt-12 bg-white px-4 py-12 md:px-8 font-friendly">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2">Our Services</h2>
            <p className="mt-3 text-lg md:text-xl text-slate-700 font-semibold">Access our range of services designed to provide support, information, and assistance for your sexual and reproductive health needs.</p>
        </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 items-stretch">
            <ServiceCard
              icon={FiBookOpen}
              title="Sexual Health Resources"
              description="Explore articles, guides, and information on sexual and reproductive health."
              to="/resources"
            />
            <ServiceCard
              icon={FiMessageSquare}
              title="AI & Professional Chat Support"
              description="Instant answers from our AI Assistant or connect live with professionals for support."
              to="/chat"
            />
            <ServiceCard
              icon={FiHeart}
              title="HIV & STI Services"
              description="Confidential testing, counseling, and linkage to care for HIV and other STIs."
              to="/resources"
            />
            <ServiceCard
              icon={FiCalendar}
              title="Medical Consultations"
              description="Speak with healthcare professionals for family planning and related care."
              to="/appointments"
            />
            <ServiceCard
              icon={FiUsers}
              title="Family Planning Procedures"
              description="Access contraceptive methods including implants and IUDs, administered by professionals."
              to="/resources"
            />
            <ServiceCard
              icon={FiShoppingBag}
              title="Health Commodity Pickup"
              description="Request and schedule a pickup for essential health commodities like condoms and OCPs."
              to="/resources"
            />
          </div>
        </div>
      </section>

      <UpcomingEventsCalendar />

      <LatestResourcesSection />
    </div>
  )
}


