import { Router } from 'express'
import { listUsers, updateUserRole } from '../controllers/user.controller.js'
import { authenticate, authorize } from '../middleware/auth.js'

const router = Router()

router.get('/', authenticate, authorize('atLeast:co_admin'), listUsers)
router.patch('/:id/role', authenticate, authorize('atLeast:co_admin'), updateUserRole)

export default router


