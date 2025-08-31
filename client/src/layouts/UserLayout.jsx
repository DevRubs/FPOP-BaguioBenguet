import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}


