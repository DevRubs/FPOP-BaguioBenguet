import { Link } from 'react-router-dom'
import { FiMapPin, FiPhone, FiMail, FiChevronRight } from 'react-icons/fi'
import { SiFacebook } from 'react-icons/si'
import FPOPName from '../assets/FPOPName.png'

export default function Footer() {
  return (
    <footer className="w-full bg-[#65A3FA] text-white text-base font-friendly">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About + logo */}
          <div>
            <div className="mb-4 inline-flex items-center rounded-md bg-white/10 p-2">
              <img src={FPOPName} alt="FPOP" className="h-16 md:h-24 w-auto object-contain" />
            </div>
            <p className="max-w-sm text-white/90 font-semibold">
              We are a service-oriented organization providing sexual and reproductive services to all Filipinos,
              especially the poor, marginalized, socially excluded and underserved.
            </p>
          </div>

          {/* Mission / Vision */}
          <div>
            <h3 className="font-extrabold text-white border-b border-white/30 pb-2">Our Mission</h3>
            <p className="mt-2 text-white/90 font-semibold">
              To lead in creating a society where sexual and reproductive health and rights are fulfilled for all,
              especially among the poor and the underserved through advocacy, partnership and service delivery.
            </p>
            <h3 className="mt-5 font-extrabold text-white border-b border-white/30 pb-2">Our Vision</h3>
            <p className="mt-2 text-white/90 font-semibold">
              FPOP envisions a world in which all Filipinos enjoy quality of life in the context of sustainable
              development and are empowered to decide freely on their sexuality and well-being in a society without
              discrimination.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-extrabold text-white border-b border-white/30 pb-2">Contact Us</h3>
            <div className="mt-3 space-y-3">
              <div>
                <div className="font-extrabold">Main Office</div>
                <FooterRow Icon={FiMapPin}>2F Market Superintendent's Building, Bagong Lipunan, Baguio City</FooterRow>
                <FooterRow Icon={FiPhone}>09129314850</FooterRow>
                <FooterRow Icon={FiMail}>baguiobenguetfpop@gmail.com</FooterRow>
              </div>
              <div className="pt-3">
                <div className="font-extrabold">Ajuwan Community Center (Service Location)</div>
                <FooterRow Icon={FiMapPin}>Room 517, Regus Co., 5th Floor, Abanao Square Mall, Baguio City</FooterRow>
                <FooterRow Icon={FiPhone}>Family Planning & Reproductive Health: 09627055060</FooterRow>
                <FooterRow Icon={FiPhone}>HIV Services: 09766531552</FooterRow>
              </div>
              <div className="pt-3">
                <div className="font-extrabold">Follow Us</div>
                <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-white hover:bg-white/20">
                  <SiFacebook /> Facebook
                </a>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-extrabold text-white border-b border-white/30 pb-2">Quick Links</h3>
            <nav className="mt-3 grid gap-2 text-white/90 font-semibold">
              <FooterLink to="/">Home</FooterLink>
              <FooterLink to="/resources">Resources</FooterLink>
              <FooterLink to="/chat">AI & Pro Chat Support</FooterLink>
              <FooterLink to="/appointments/new">Book an Appointment</FooterLink>
              <FooterLink to="/volunteer">Volunteer</FooterLink>
              <FooterLink to="/about">About</FooterLink>
            </nav>
          </div>
        </div>

        <hr className="my-8 border-white/20" />
        <div className="text-center text-white/90 font-semibold">
          © {new Date().getFullYear()} Family Planning Organization of The Philippines. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

function FooterRow({ Icon, children }) {
  return (
    <div className="mt-1 flex items-start gap-2 text-white/90">
      <span className="mt-1 inline-flex h-4 w-4 items-center justify-center"><Icon size={16} /></span>
      <span className="leading-relaxed">{children}</span>
    </div>
  )
}

function FooterLink({ to, children }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 hover:text-white">
      <FiChevronRight /> {children}
    </Link>
  )
}


