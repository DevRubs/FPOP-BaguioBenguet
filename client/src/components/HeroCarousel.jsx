import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

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

export default HeroCarousel
