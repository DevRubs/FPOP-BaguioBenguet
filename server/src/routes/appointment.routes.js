import { Router } from 'express'
import csrf from 'csurf'
import { authenticate, authorize } from '../middleware/auth.js'
import {
  createAppointment,
  listMyAppointments,
  getMyAppointment,
  cancelMyAppointment,
  adminListAppointments,
  adminUpdateAppointmentStatus,
} from '../controllers/appointment.controller.js'

const router = Router()
const csrfProtection = csrf({ cookie: { httpOnly: false, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' } })

// User
router.get('/', authenticate, listMyAppointments)
router.post('/', authenticate, csrfProtection, createAppointment)
router.get('/:id', authenticate, getMyAppointment)
router.post('/:id/cancel', authenticate, csrfProtection, cancelMyAppointment)

// Admin
router.get('/admin/all', authenticate, authorize('atLeast:co_admin'), adminListAppointments)
router.patch('/admin/:id/status', authenticate, authorize('atLeast:co_admin'), csrfProtection, adminUpdateAppointmentStatus)

export default router



