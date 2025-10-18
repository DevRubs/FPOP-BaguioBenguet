import { Router } from 'express'
import csrf from 'csurf'
import { authenticate, authorize } from '../middleware/auth.js'
import {
  getEvents,
  getEventsForCalendar,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  adminGetEvents,
} from '../controllers/event.controller.js'

const router = Router()
const csrfProtection = csrf({ cookie: { httpOnly: false, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' } })

// Public routes
router.get('/', getEvents)
router.get('/calendar', getEventsForCalendar)
router.get('/:id', getEvent)

// Admin routes
router.get('/admin/all', authenticate, authorize('atLeast:co_admin'), adminGetEvents)
router.post('/', authenticate, authorize('atLeast:co_admin'), csrfProtection, createEvent)
router.put('/:id', authenticate, authorize('atLeast:co_admin'), csrfProtection, updateEvent)
router.delete('/:id', authenticate, authorize('atLeast:co_admin'), csrfProtection, deleteEvent)

export default router
