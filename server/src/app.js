import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import healthRouter from './routes/health.routes.js'
import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.routes.js'
import appointmentRouter from './routes/appointment.routes.js'
import notificationRouter from './routes/notification.routes.js'
import volunteerRouter from './routes/volunteer.routes.js'
import youthArchiveRouter from './routes/youthArchive.routes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

const app = express()

// Trust proxy (needed for secure cookies behind proxy)
if (process.env.NODE_ENV === 'production') {
  // express trusts X-Forwarded-* headers
  app.set('trust proxy', 1)
}

// Security headers
app.use(helmet())

// CORS (restrict in production)
const allowedOrigins = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean)
app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true)
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return cb(null, true)
    return cb(new Error('Not allowed by CORS'))
  },
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

// CSRF protection using double-submit cookie strategy
const csrfProtection = csrf({ cookie: { httpOnly: false, sameSite: 'strict', secure: process.env.NODE_ENV === 'production' } })

// Issue CSRF token for GETs
app.get('/api/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() })
})

// Routes
app.use('/api/health', healthRouter)
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/appointments', appointmentRouter)
app.use('/api/notifications', notificationRouter)
app.use('/api/volunteers', volunteerRouter)
app.use('/api/youth-archive', youthArchiveRouter)

// 404 and error handlers
app.use(notFound)
app.use(errorHandler)

export default app


