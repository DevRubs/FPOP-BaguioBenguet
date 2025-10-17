import { Router } from 'express'
import csrf from 'csurf'
import { authenticate } from '../middleware/auth.js'
import { listMyNotifications, markNotificationRead, markAllRead, getUnreadCount, deleteMyNotification } from '../controllers/notification.controller.js'

const router = Router()
const csrfProtection = csrf({ cookie: { httpOnly: false, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' } })

router.get('/', authenticate, listMyNotifications)
router.get('/unread-count', authenticate, getUnreadCount)
router.post('/mark-all-read', authenticate, csrfProtection, markAllRead)
router.post('/:id/read', authenticate, csrfProtection, markNotificationRead)
router.delete('/:id', authenticate, csrfProtection, deleteMyNotification)

export default router



