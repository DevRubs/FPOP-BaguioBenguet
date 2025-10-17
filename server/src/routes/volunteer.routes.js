import { Router } from 'express'
import csrf from 'csurf'
import { authenticate, authorize } from '../middleware/auth.js'
import { createApplication, adminListApplications, adminUpdateStatus, adminUpdateNotes } from '../controllers/volunteer.controller.js'

const router = Router()
const csrfProtection = csrf({ cookie: { httpOnly: false, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' } })

// User submit application
router.post('/', authenticate, csrfProtection, createApplication)

// Admin management
router.get('/admin/all', authenticate, authorize('atLeast:co_admin'), adminListApplications)
router.patch('/admin/:id/status', authenticate, authorize('atLeast:co_admin'), csrfProtection, adminUpdateStatus)
router.patch('/admin/:id/notes', authenticate, authorize('atLeast:co_admin'), csrfProtection, adminUpdateNotes)

export default router


