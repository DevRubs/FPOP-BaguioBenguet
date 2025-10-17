import { Router } from 'express'
import csrf from 'csurf'
import { authenticate, authorize } from '../middleware/auth.js'
import {
  getArchiveItems,
  adminGetAllItems,
  adminCreateItem,
  adminUpdateItem,
  adminDeleteItem,
  adminGetItem,
} from '../controllers/youthArchive.controller.js'

const router = Router()
const csrfProtection = csrf({ cookie: { httpOnly: false, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' } })

// Public routes (no auth required)
router.get('/', getArchiveItems)

// Admin routes
router.get('/admin/all', authenticate, authorize('atLeast:co_admin'), adminGetAllItems)
router.get('/admin/:id', authenticate, authorize('atLeast:co_admin'), adminGetItem)
router.post('/admin', authenticate, authorize('atLeast:co_admin'), csrfProtection, adminCreateItem)
router.patch('/admin/:id', authenticate, authorize('atLeast:co_admin'), csrfProtection, adminUpdateItem)
router.delete('/admin/:id', authenticate, authorize('atLeast:co_admin'), csrfProtection, adminDeleteItem)

export default router
