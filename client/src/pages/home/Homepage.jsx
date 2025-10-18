import { Link } from 'react-router-dom'
import { FiBookOpen, FiMessageSquare, FiHeart, FiCalendar, FiUsers, FiShoppingBag, FiChevronRight as FiArrowRight } from 'react-icons/fi'
import CarouselPhoto1 from '../../assets/CarouselPhoto1.jpg'
import CarouselPhoto2 from '../../assets/CarouselPhoto2.jpg'
import CarouselPhoto5 from '../../assets/CarouselPhoto5.jpg'
import HeroCarousel from '../../components/HeroCarousel'
import UpcomingEventsCalendar from '../../components/UpcomingEventsCalendar'
import LatestResourcesSection from '../../components/LatestResourcesSection'


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


