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

function formatDateTime(dt) {
  try { return new Date(dt).toLocaleString() } catch { return String(dt) }
}

export async function sendAppointmentCreatedEmail({ to, appointment }) {
  const baseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:5173'
  const link = `${baseUrl}/appointments`
  const transporter = createTransporter()
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@example.com',
    to,
    subject: 'Appointment request received',
    html: `
      <p>We received your appointment request.</p>
      <p><b>Type:</b> ${appointment.type}<br/>
         <b>When:</b> ${formatDateTime(appointment.startAt)}<br/>
         <b>Location:</b> ${appointment.location}
      </p>
      <p>You can view your appointments here: <a href="${link}">${link}</a></p>
    `,
  })
}

export async function sendAppointmentCancelledEmail({ to, appointment }) {
  const baseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:5173'
  const link = `${baseUrl}/appointments`
  const transporter = createTransporter()
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@example.com',
    to,
    subject: 'Appointment cancelled',
    html: `
      <p>Your appointment has been cancelled.</p>
      <p><b>Type:</b> ${appointment.type}<br/>
         <b>When:</b> ${formatDateTime(appointment.startAt)}<br/>
         <b>Location:</b> ${appointment.location}
      </p>
      <p>You can view your appointments here: <a href="${link}">${link}</a></p>
    `,
  })
}

export async function sendAppointmentStatusEmail({ to, appointment, status }) {
  const baseUrl = process.env.FRONTEND_BASE_URL || 'http://localhost:5173'
  const link = `${baseUrl}/appointments`
  const transporter = createTransporter()
  const subject = `Appointment ${status}`
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@example.com',
    to,
    subject,
    html: `
      <p>Your appointment status has been updated.</p>
      <p><b>Status:</b> ${status}<br/>
         <b>Type:</b> ${appointment.type}<br/>
         <b>When:</b> ${formatDateTime(appointment.startAt)}<br/>
         <b>Location:</b> ${appointment.location}
      </p>
      <p>Manage your appointments here: <a href="${link}">${link}</a></p>
    `,
  })
}

export async function sendVolunteerSubmittedEmail({ to, application }) {
  const transporter = createTransporter()
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@example.com',
    to,
    subject: 'Volunteer application received',
    html: `
      <p>Thanks for applying to volunteer!</p>
      <p>We received your application and our team will review it.</p>
      <p><b>Name:</b> ${application.fullName}<br/>
         <b>Phone:</b> ${application.phone}<br/>
         <b>City:</b> ${application.city || '-'}
      </p>
    `,
  })
}

export async function sendVolunteerStatusEmail({ to, application, status }) {
  const transporter = createTransporter()
  const subject = `Volunteer application ${status}`
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'no-reply@example.com',
    to,
    subject,
    html: `
      <p>Your volunteer application status has been updated.</p>
      <p><b>Status:</b> ${status}<br/>
         <b>Name:</b> ${application.fullName}<br/>
         <b>Phone:</b> ${application.phone}
      </p>
    `,
  })
}


