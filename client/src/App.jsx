import { Suspense, useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout.jsx'
import UserLayout from './layouts/UserLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import Homepage from './pages/home/Homepage.jsx'
import ResourcesList from './pages/resources/ResourcesList.jsx'
import ArticleView from './pages/resources/ArticleView.jsx'
import YouthArchive from './pages/youthArchive/YouthArchive.jsx'
import VolunteerSignup from './pages/volunteer/VolunteerSignup.jsx'
import AboutPage from './pages/about/AboutPage.jsx'
import ChatPage from './pages/chat/ChatPage.jsx'
import NotificationCenter from './pages/notifications/NotificationCenter.jsx'
import UserDashboard from './pages/dashboard/UserDashboard.jsx'
import AppointmentList from './pages/appointments/AppointmentList.jsx'
import AppointmentForm from './pages/appointments/AppointmentForm.jsx'
import Loader from './components/Loader.jsx'
import { lazy } from 'react'
const AdminDashboard = lazy(() => import('./pages/admin/dashboard/AdminDashboard.jsx'))
const ChatbotControl = lazy(() => import('./pages/admin/chatbot/ChatbotControl.jsx'))
const AdminSupportChat = lazy(() => import('./pages/admin/supportChat/AdminSupportChat.jsx'))
const AdminAppointments = lazy(() => import('./pages/admin/appointments/AdminAppointments.jsx'))
const AdminVolunteers = lazy(() => import('./pages/admin/volunteers/AdminVolunteers.jsx'))
const AdminEvents = lazy(() => import('./pages/admin/events/AdminEvents.jsx'))
const AdminResources = lazy(() => import('./pages/admin/resources/AdminResources.jsx'))
const AdminUsers = lazy(() => import('./pages/admin/users/AdminUsers.jsx'))
const AdminNotifications = lazy(() => import('./pages/admin/notifications/AdminNotifications.jsx'))
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import ForgotPassword from './pages/auth/ForgotPassword.jsx'
import ResetPassword from './pages/auth/ResetPassword.jsx'
import VerifyEmail from './pages/auth/VerifyEmail.jsx'
import SettingsPage from './pages/settings/SettingsPage.jsx'
import NotFound from './pages/notFound/NotFound.jsx'

export default function App() {
  const [apiStatus, setApiStatus] = useState('loading…')

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((data) => setApiStatus(`${data.status} @ ${new Date(data.timestamp).toLocaleTimeString()}`))
      .catch(() => setApiStatus('unreachable'))
  }, [])

  return (
    <Routes>
      {/* Public layout and pages */}
      <Route element={<PublicLayout /> }>
        <Route path="/" element={<Homepage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/resources" element={<ResourcesList />} />
        <Route path="/resources/:id" element={<ArticleView />} />
        <Route path="/youth-archive" element={<YouthArchive />} />
        <Route path="/volunteer" element={<VolunteerSignup />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Public 404 within layout */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* User protected area */}
      <Route element={<PrivateRoute /> }>
        <Route element={<UserLayout /> }>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/appointments" element={<AppointmentList />} />
          <Route path="/appointments/new" element={<AppointmentForm />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationCenter />} />
        </Route>
      </Route>

      {/* Admin protected area */}
      <Route element={<AdminRoute /> }>
        <Route path="/admin" element={<AdminLayout /> }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Suspense fallback={<Loader />}><AdminDashboard /></Suspense>} />
          <Route path="chatbot" element={<Suspense fallback={<Loader />}><ChatbotControl /></Suspense>} />
          <Route path="support-chat" element={<Suspense fallback={<Loader />}><AdminSupportChat /></Suspense>} />
          <Route path="appointments" element={<Suspense fallback={<Loader />}><AdminAppointments /></Suspense>} />
          <Route path="volunteers" element={<Suspense fallback={<Loader />}><AdminVolunteers /></Suspense>} />
          <Route path="events" element={<Suspense fallback={<Loader />}><AdminEvents /></Suspense>} />
          <Route path="resources" element={<Suspense fallback={<Loader />}><AdminResources /></Suspense>} />
          <Route path="users" element={<Suspense fallback={<Loader />}><AdminUsers /></Suspense>} />
          <Route path="notifications" element={<Suspense fallback={<Loader />}><AdminNotifications /></Suspense>} />
          {/* Admin 404 inside admin shell (optional: custom admin not found) */}
          <Route path="*" element={<Suspense fallback={<Loader />}><AdminDashboard /></Suspense>} />
        </Route>
      </Route>

      {/* Global fallback (should rarely hit due to PublicLayout catch-all) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
