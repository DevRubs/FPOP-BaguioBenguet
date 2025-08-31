import { Router } from 'express'
import { register, login, logout, forgotPassword, resetPassword, me, verifyEmail, verifyEmailPost, resendVerification, permissions, permissionsTable, canAccessTab } from '../controllers/auth.controller.js'
import { authenticate, authorize } from '../middleware/auth.js'
import { authLimiter, loginLimiter, emailLimiter } from '../middleware/rateLimiters.js'
import csrf from 'csurf'

const csrfProtection = csrf({ cookie: { httpOnly: false, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' } })

const router = Router()

router.post('/register', csrfProtection, authLimiter, register)
router.post('/login', csrfProtection, loginLimiter, login)
router.post('/logout', csrfProtection, logout)
router.post('/forgot-password', csrfProtection, emailLimiter, forgotPassword)
router.post('/reset-password', csrfProtection, resetPassword)
router.get('/me', authenticate, me)
router.get('/verify-email', verifyEmail)
router.post('/verify-email', csrfProtection, verifyEmailPost)
router.post('/resend-verification', csrfProtection, emailLimiter, resendVerification)
router.get('/permissions', authenticate, permissions)
router.get('/permissions/table', authenticate, authorize('atLeast:co_admin'), permissionsTable)
router.get('/permissions/check', authenticate, canAccessTab)

export default router


