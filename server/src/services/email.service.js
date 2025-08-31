import nodemailer from 'nodemailer'

function createTransporter() {
  const host = process.env.SMTP_HOST
  const port = Number(process.env.SMTP_PORT || 587)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    throw new Error('SMTP configuration missing (SMTP_HOST, SMTP_USER, SMTP_PASS)')
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

export async function sendPasswordResetEmail({ to, token }) {
  const baseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:5173'
  const resetUrl = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`
  const transporter = createTransporter()

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@example.com',
    to,
    subject: 'Reset your password',
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to set a new password. This link expires in 1 hour.</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
  })
}

export async function sendVerificationEmail({ to, code }) {
  const transporter = createTransporter()

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@example.com',
    to,
    subject: 'Your verification code',
    html: `
      <p>Welcome! Please verify your email address.</p>
      <p>Use the code below to verify your account. This code expires in 24 hours.</p>
      <p style="font-size: 20px; font-weight: bold; letter-spacing: 4px;">${code}</p>
      <p>If you didn't create an account, you can ignore this email.</p>
    `,
  })
}


