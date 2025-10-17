import Appointment from '../models/Appointment.js'
import Notification from '../models/Notification.js'

function isSunday(date) {
  return date.getUTCDay() === 0
}

function withinBusinessHours(date, timeTzOffsetMinutes) {
  // Business hours: Mon-Fri 10:00-19:00, Sat 13:00-19:00 (local time assumed provided by client)
  // We trust client to only allow valid times; server does a coarse check against Sunday only.
  return !isSunday(date)
}

export async function createAppointment(req, res, next) {
  try {
    const { type, date, time, location, notes } = req.body
    if (!type || !date || !time || !location) {
      return res.status(400).json({ message: 'type, date, time, location are required' })
    }

    const startAt = new Date(`${date}T${time}:00.000Z`)
    if (Number.isNaN(startAt.getTime())) {
      return res.status(400).json({ message: 'Invalid date/time' })
    }
    if (!withinBusinessHours(startAt)) {
      return res.status(400).json({ message: 'Selected date/time is unavailable' })
    }

    const appt = await Appointment.create({
      user: req.user.id,
      type,
      startAt,
      location,
      notes: notes || '',
    })

    await Notification.create({
      user: req.user.id,
      title: 'Appointment requested',
      body: `We received your ${type} request for ${new Date(startAt).toLocaleString()}.`,
      meta: { appointmentId: appt._id, kind: 'appointment_created' },
    })

    res.status(201).json({ appointment: appt })
  } catch (err) {
    next(err)
  }
}

export async function listMyAppointments(req, res, next) {
  try {
    const { status } = req.query
    const filter = { user: req.user.id }
    if (status && ['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      filter.status = status
    }
    const items = await Appointment.find(filter).sort({ startAt: 1 })
    res.json({ appointments: items })
  } catch (err) {
    next(err)
  }
}

export async function getMyAppointment(req, res, next) {
  try {
    const { id } = req.params
    const appt = await Appointment.findOne({ _id: id, user: req.user.id })
    if (!appt) return res.status(404).json({ message: 'Not found' })
    res.json({ appointment: appt })
  } catch (err) {
    next(err)
  }
}

export async function cancelMyAppointment(req, res, next) {
  try {
    const { id } = req.params
    const appt = await Appointment.findOne({ _id: id, user: req.user.id })
    if (!appt) return res.status(404).json({ message: 'Not found' })
    if (appt.status === 'cancelled') return res.json({ appointment: appt })
    appt.status = 'cancelled'
    await appt.save()
    await Notification.create({
      user: req.user.id,
      title: 'Appointment cancelled',
      body: `Your appointment on ${new Date(appt.startAt).toLocaleString()} was cancelled.`,
      meta: { appointmentId: appt._id, kind: 'appointment_cancelled' },
    })
    res.json({ appointment: appt })
  } catch (err) {
    next(err)
  }
}

// Admin
export async function adminListAppointments(req, res, next) {
  try {
    const { status, userId } = req.query
    const filter = {}
    if (status && ['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      filter.status = status
    }
    if (userId) filter.user = userId
    const items = await Appointment.find(filter).populate('user', 'name email role').sort({ startAt: 1 })
    res.json({ appointments: items })
  } catch (err) {
    next(err)
  }
}

export async function adminUpdateAppointmentStatus(req, res, next) {
  try {
    const { id } = req.params
    const { status } = req.body
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }
    const appt = await Appointment.findById(id)
    if (!appt) return res.status(404).json({ message: 'Not found' })
    appt.status = status
    await appt.save()

    await Notification.create({
      user: appt.user,
      title: `Appointment ${status}`,
      body: `Your appointment on ${new Date(appt.startAt).toLocaleString()} is now ${status}.`,
      meta: { appointmentId: appt._id, kind: 'appointment_status', status },
    })

    res.json({ appointment: appt })
  } catch (err) {
    next(err)
  }
}


