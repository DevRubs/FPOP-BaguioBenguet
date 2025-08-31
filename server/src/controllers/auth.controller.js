import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import User from '../models/User.js'
import { sendPasswordResetEmail, sendVerificationEmail } from '../services/email.service.js'
import { isStrongPassword, isValidEmail } from '../utils/validators.js'

function createJwtToken(payload, expiresIn) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn })
}

function setAuthCookie(res, token) {
  const isProd = process.env.NODE_ENV === 'production'
  res.cookie('token', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'strict' : 'lax',
    maxAge: 3 * 24 * 60 * 60 * 1000,
  })
}

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, and password are required' })
    }
    if (!isValidEmail(email)) return res.status(400).json({ message: 'Invalid email' })
    if (!isStrongPassword(password)) return res.status(400).json({ message: 'Password is too weak (min 8, upper, lower, number, special)' })

    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ message: 'Email already in use' })

    const passwordHash = await bcrypt.hash(password, 10)
    // Generate a 6-digit verification code and store its hash
    const verifyCode = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0')
    const verifyHash = crypto.createHash('sha256').update(verifyCode).digest('hex')

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: 'user',
      isEmailVerified: false,
      emailVerificationToken: verifyHash,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })

    await sendVerificationEmail({ to: user.email, code: verifyCode })

    res.status(201).json({ message: 'Registered. Please verify your email to log in.' })
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'email and password are required' })

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    // Check lockout
    if (user.loginBlockedUntil && user.loginBlockedUntil > new Date()) {
      const remainingMs = user.loginBlockedUntil.getTime() - Date.now()
      const minutes = Math.ceil(remainingMs / 60000)
      return res.status(429).json({ message: `Too many attempts. Try again in ~${minutes}m.` })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      user.loginFailedAttempts = (user.loginFailedAttempts || 0) + 1
      // Lockout policy: 5 failures => 10 minutes block
      if (user.loginFailedAttempts >= 5) {
        user.loginBlockedUntil = new Date(Date.now() + 10 * 60 * 1000)
        user.loginFailedAttempts = 0
      }
      await user.save()
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Reset counters on success
    user.loginFailedAttempts = 0
    user.loginBlockedUntil = null
    await user.save()

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: 'Email not verified', verifyRequired: true })
    }

    const token = createJwtToken({ id: user._id, role: user.role, tokenVersion: user.tokenVersion || 0 }, '3d')
    setAuthCookie(res, token)

    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role } })
  } catch (err) {
    next(err)
  }
}

export async function logout(req, res, next) {
  try {
    res.clearCookie('token')
    res.json({ message: 'Logged out' })
  } catch (err) {
    next(err)
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'email is required' })

    const user = await User.findOne({ email })
    if (!user) return res.status(200).json({ message: 'If that email exists, a reset was sent' })

    const rawToken = crypto.randomBytes(32).toString('hex')
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex')
    user.passwordResetToken = tokenHash
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000)
    await user.save()

    await sendPasswordResetEmail({ to: user.email, token: rawToken })

    res.json({ message: 'If that email exists, a reset was sent' })
  } catch (err) {
    next(err)
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body
    if (!token || !password) return res.status(400).json({ message: 'token and new password are required' })
    if (!isStrongPassword(password)) return res.status(400).json({ message: 'Password is too weak (min 8, upper, lower, number, special)' })

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({
      passwordResetToken: tokenHash,
      passwordResetExpires: { $gt: new Date() },
    })

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' })

    user.passwordHash = await bcrypt.hash(password, 10)
    // Invalidate existing sessions
    user.tokenVersion = (user.tokenVersion || 0) + 1
    user.passwordResetToken = null
    user.passwordResetExpires = null
    await user.save()

    res.json({ message: 'Password successfully reset' })
  } catch (err) {
    next(err)
  }
}

export async function verifyEmail(req, res, next) {
  try {
    // For code-based verification, GET only informs user to enter the code.
    return res.status(200).json({ message: 'Enter the code we emailed you to verify.' })
  } catch (err) {
    next(err)
  }
}

export async function verifyEmailPost(req, res, next) {
  try {
    const { email, code } = req.body
    if (!email || !code) return res.status(400).json({ message: 'email and code are required' })
    const tokenHash = crypto.createHash('sha256').update(code).digest('hex')
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid or expired code' })

    // Check verify cooldown
    if (user.verifyBlockedUntil && user.verifyBlockedUntil > new Date()) {
      const remainingMs = user.verifyBlockedUntil.getTime() - Date.now()
      const minutes = Math.ceil(remainingMs / 60000)
      return res.status(429).json({ message: `Too many attempts. Try again in ~${minutes}m.` })
    }
    if (!user || !user.emailVerificationToken || !user.emailVerificationExpires || user.emailVerificationExpires <= new Date()) {
      return res.status(400).json({ message: 'Invalid or expired code' })
    }
    if (user.emailVerificationToken !== tokenHash) {
      user.verifyFailedAttempts = (user.verifyFailedAttempts || 0) + 1
      // 5 wrong codes => 10 min cool-down
      if (user.verifyFailedAttempts >= 5) {
        user.verifyBlockedUntil = new Date(Date.now() + 10 * 60 * 1000)
        user.verifyFailedAttempts = 0
      }
      await user.save()
      return res.status(400).json({ message: 'Invalid or expired code' })
    }

    if (user.isEmailVerified) {
      return res.json({ message: 'Email already verified' })
    }

    user.isEmailVerified = true
    user.emailVerificationToken = null
    user.emailVerificationExpires = null
    user.verifyFailedAttempts = 0
    user.verifyBlockedUntil = null
    await user.save()

    res.json({ message: 'Email verified successfully' })
  } catch (err) {
    next(err)
  }
}

export async function resendVerification(req, res, next) {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ message: 'email is required' })
    const user = await User.findOne({ email })
    if (!user) return res.status(200).json({ message: 'If that email exists, a verification was sent' })
    if (user.isEmailVerified) return res.status(200).json({ message: 'Email already verified' })

    const verifyCode = String(crypto.randomInt(0, 1_000_000)).padStart(6, '0')
    const verifyHash = crypto.createHash('sha256').update(verifyCode).digest('hex')
    user.emailVerificationToken = verifyHash
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await user.save()

    await sendVerificationEmail({ to: user.email, code: verifyCode })
    res.json({ message: 'Verification email sent' })
  } catch (err) {
    next(err)
  }
}

export async function permissions(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
    const { TAB_PERMISSIONS } = await import('../utils/roles.js')
    const map = TAB_PERMISSIONS
    const role = req.user.role
    const allowedTabs = Object.entries(map)
      .filter(([_, access]) => Boolean(access[role]))
      .map(([tab]) => tab)
    res.json({ role, allowedTabs })
  } catch (err) {
    next(err)
  }
}

export async function permissionsTable(req, res, next) {
  try {
    const { buildPermissionsTable } = await import('../utils/roles.js')
    const result = buildPermissionsTable()
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function canAccessTab(req, res, next) {
  try {
    const { role, tab } = req.query
    if (!role || !tab) return res.status(400).json({ message: 'role and tab are required' })
    const { canRoleAccessTab } = await import('../utils/roles.js')
    const allowed = canRoleAccessTab(role, tab)
    res.json({ role, tab, allowed })
  } catch (err) {
    next(err)
  }
}

export async function me(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
    const user = await User.findById(req.user.id).select('_id name email role')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  } catch (err) {
    next(err)
  }
}


