import { FiZap, FiTarget, FiEye, FiUsers, FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi'
import FPOPLogo from '../../assets/FPOP.png'
import AHFLogo from '../../assets/AHF.png'
import AustralianAidLogo from '../../assets/AUSTRALIANAID.png'
import IPPFLogo from '../../assets/IPPF.png'
import LoveYourselfLogo from '../../assets/NEW LoveYourself Logo vertical.png'
import ProtectsUpscaleLogo from '../../assets/Protects upscale logo.png'
import ShellFoundationLogo from '../../assets/shell foundation.png'

export default function AboutPage() {
  return (
    <section className="px-4 md:px-8 py-8 md:py-12 font-friendly">
      <div className="mx-auto max-w-6xl">
        {/* Who We Are */}
        <header className="mb-4 text-center">
          <div className="inline-flex items-center gap-2 text-[#1E3A8A]">
            <FiUsers />
            <h2 className="text-2xl md:text-3xl font-extrabold">Who We Are</h2>
          </div>
        </header>
        <div className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-5 md:p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] items-center gap-6">
            <div className="flex items-center justify-center">
              <img src={FPOPLogo} alt="FPOP logo" className="h-16 md:h-20 w-auto object-contain" />
            </div>
            <div className="text-slate-700 font-semibold leading-relaxed">
              <p className="mb-3">
                The Family Planning Organization of the Philippines (FPOP) Baguio–Benguet Chapter is a service-oriented
                organization dedicated to providing sexual and reproductive health services to all Filipinos, with a
                special focus on serving the poor, marginalized, socially excluded, and underserved communities.
              </p>
              <p>
                We work tirelessly to ensure that all individuals have access to comprehensive sexual and reproductive
                health education, services, and support, regardless of their socioeconomic status or background.
              </p>
            </div>
          </div>
        </div>

        <header className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 text-[#1E3A8A]">
            <FiZap />
            <h1 className="text-3xl md:text-4xl font-extrabold">Our Mission & Vision</h1>
          </div>
          <p className="mt-2 text-lg text-slate-700 font-semibold">Guiding principles that drive our work in the community.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MissionCard
            Icon={FiTarget}
            title="Our Mission"
            gradient="from-blue-50 to-white"
          >
            To lead in creating a society where sexual and reproductive health and rights are fulfilled for all, especially among the poor and the underserved through advocacy, partnership, and service delivery.
          </MissionCard>

          <MissionCard
            Icon={FiEye}
            title="Our Vision"
            gradient="from-indigo-50 to-white"
          >
            FPOP envisions a world in which all Filipinos enjoy quality of life in the context of sustainable development and are empowered to decide freely on their sexuality and well-being in a society without discrimination.
          </MissionCard>
        </div>

        {/* Our Partners */}
        <header className="mt-12 mb-4 text-center">
          <div className="inline-flex items-center gap-2 text-[#1E3A8A]">
            <FiUsers />
            <h2 className="text-2xl md:text-3xl font-extrabold">Our Partners</h2>
          </div>
          <p className="mt-1 text-slate-700 font-semibold">We collaborate with various organizations to better serve our community.</p>
        </header>
        <div className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-5 md:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8 place-items-center">
            <PartnerLogo src={AHFLogo} name="AIDS Healthcare Foundation" />
            <PartnerLogo src={AustralianAidLogo} name="Australian Aid" />
            <PartnerLogo src={IPPFLogo} name="International Planned Parenthood Federation" />
            <PartnerLogo src={LoveYourselfLogo} name="LoveYourself" />
            <PartnerLogo src={ProtectsUpscaleLogo} name="Protects Upscale" />
            <PartnerLogo src={ShellFoundationLogo} name="Pilipinas Shell Foundation" />
          </div>
        </div>

        {/* Visit Us */}
        <header className="mt-12 mb-4 text-center">
          <div className="inline-flex items-center gap-2 text-[#1E3A8A]">
            <FiMapPin />
            <h2 className="text-2xl md:text-3xl font-extrabold">Visit Us</h2>
          </div>
          <p className="mt-1 text-slate-700 font-semibold">Get in touch with us or visit our offices for assistance.</p>
        </header>
        <div className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-5 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ContactCard title="FPOP Baguio-Benguet - Main Office">
              <ContactRow Icon={FiMapPin} label="Address">
                2nd Floor, Superintendent Building, Bagong Lipunan, Baguio City
              </ContactRow>
              <ContactRow Icon={FiPhone} label="Contact Number">
                09129314850
              </ContactRow>
              <ContactRow Icon={FiMail} label="Email">
                baguioBenguetfpop@gmail.com
              </ContactRow>
            </ContactCard>

            <ContactCard title="FPOP Ajuwan Community Center">
              <ContactRow Icon={FiMapPin} label="Address (All Services & Commodity Pickup)">
                Room 517, Regus Co., 5th Floor, Abanao Square Mall, Baguio City
              </ContactRow>
              <ContactRow Icon={FiPhone} label="Family Planning & RH Services">
                09627055060
              </ContactRow>
              <ContactRow Icon={FiPhone} label="HIV Services">
                09766531552
              </ContactRow>
              <ContactRow Icon={FiClock} label="General Hours (Ajuwan Center)">
                Monday - Friday: 9:00 AM - 6:00 PM (Service hours may vary, check booking page)
              </ContactRow>
            </ContactCard>
          </div>
        </div>
      </div>
    </section>
  )
}

function MissionCard({ Icon, title, children, gradient }) {
  return (
    <article className={`rounded-2xl border border-[#65A3FA] bg-gradient-to-b ${gradient} shadow-lg p-5 md:p-6`}>
      <div className="flex items-start gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1E3A8A] shadow">
          <Icon />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#1E3A8A]">{title}</h2>
          <p className="mt-2 text-slate-700 font-semibold leading-relaxed">
            {children}
          </p>
        </div>
      </div>
    </article>
  )
}

function PartnerLogo({ src, name }) {
  return (
    <div className="flex flex-col items-center text-center gap-2">
      <img src={src} alt={name} className="h-10 md:h-12 w-auto object-contain" />
      <div className="text-sm text-slate-700 font-semibold max-w-[14rem]">{name}</div>
    </div>
  )
}

function ContactCard({ title, children }) {
  return (
    <article className="rounded-2xl border border-[#65A3FA] bg-white shadow-lg p-5 md:p-6">
      <h3 className="text-lg md:text-xl font-extrabold text-[#1E3A8A] mb-3 border-b border-slate-200 pb-2">{title}</h3>
      <div className="space-y-4">{children}</div>
    </article>
  )
}

function ContactRow({ Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1E3A8A] shadow">
        <Icon />
      </div>
      <div>
        <div className="text-sm font-bold text-slate-700">{label}</div>
        <div className="text-sm md:text-base text-slate-700 font-semibold">{children}</div>
      </div>
    </div>
  )
}