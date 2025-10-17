import VolunteerApplication from '../models/VolunteerApplication.js'
import Notification from '../models/Notification.js'
import csrf from 'csurf'
import { sendVolunteerSubmittedEmail, sendVolunteerStatusEmail } from '../services/email.service.js'

export async function createApplication(req, res, next) {
  try {
    const { fullName, email, phone, age, city, availability, skills, motivation } = req.body
    if (!fullName || !email || !phone) return res.status(400).json({ message: 'fullName, email, phone are required' })

    const app = await VolunteerApplication.create({
      user: req.user.id,
      fullName,
      email,
      phone,
      age: typeof age === 'number' ? age : undefined,
      city: city || '',
      availability: availability || '',
      skills: Array.isArray(skills) ? skills : (skills ? String(skills).split(',').map(s => s.trim()).filter(Boolean) : []),
      motivation: motivation || '',
    })

    await Notification.create({
      user: req.user.id,
      title: 'Volunteer application received',
      body: 'Thanks for applying to volunteer. We will review your application.',
      meta: { volunteerId: app._id, kind: 'volunteer_created' },
    })

    // Fire-and-forget email
    ;(async () => {
      try {
        await sendVolunteerSubmittedEmail({ to: app.email, application: app })
      } catch {}
    })()

    res.status(201).json({ application: app })
  } catch (err) {
    next(err)
  }
}

export async function adminListApplications(req, res, next) {
  try {
    const { status, city, q } = req.query
    const filter = {}
    if (status && ['pending', 'approved', 'rejected', 'withdrawn'].includes(status)) filter.status = status
    if (city) filter.city = city
    if (q) {
      filter.$or = [
        { fullName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { motivation: { $regex: q, $options: 'i' } },
      ]
    }
    const items = await VolunteerApplication.find(filter).sort({ createdAt: -1 })
    res.json({ applications: items })
  } catch (err) {
    next(err)
  }
}

export async function adminUpdateStatus(req, res, next) {
  try {
    const { id } = req.params
    const { status } = req.body
    if (!['pending', 'approved', 'rejected', 'withdrawn'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' })
    }
    const app = await VolunteerApplication.findById(id)
    if (!app) return res.status(404).json({ message: 'Not found' })
    app.status = status
    await app.save()

    await Notification.create({
      user: app.user,
      title: `Volunteer application ${status}`,
      body: `Your volunteer application is now ${status}.`,
      meta: { volunteerId: app._id, kind: 'volunteer_status', status },
    })

    // Fire-and-forget email
    ;(async () => {
      try {
        await sendVolunteerStatusEmail({ to: app.email, application: app, status })
      } catch {}
    })()

    res.json({ application: app })
  } catch (err) {
    next(err)
  }
}

// Notes functionality removed


