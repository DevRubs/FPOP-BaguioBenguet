import rateLimit from 'express-rate-limit'

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})

export const emailLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: 'Too many email requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})


