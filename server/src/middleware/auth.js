import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { hasAtLeastRole } from '../utils/roles.js'

export async function authenticate(req, res, next) {
  try {
    const token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.split(' ')[1] : null)
    if (!token) return res.status(401).json({ message: 'Unauthorized' })

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id).select('_id role tokenVersion')
    if (!user) return res.status(401).json({ message: 'Unauthorized' })
    if (typeof decoded.tokenVersion === 'number' && decoded.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    req.user = { id: user._id, role: user.role }
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
    if (allowedRoles.length === 1 && allowedRoles[0].includes(':')) {
      // syntax: 'atLeast:co_admin'
      const [_, reqRole] = allowedRoles[0].split(':')
      if (!hasAtLeastRole(req.user.role, reqRole)) return res.status(403).json({ message: 'Forbidden' })
      return next()
    }
    if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ message: 'Forbidden' })
    next()
  }
}


