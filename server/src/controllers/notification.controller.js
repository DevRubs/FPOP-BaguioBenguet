import Notification from '../models/Notification.js'

export async function listMyNotifications(req, res, next) {
  try {
    const { onlyUnread } = req.query
    const filter = { user: req.user.id }
    if (String(onlyUnread) === 'true') filter.read = false
    const items = await Notification.find(filter).sort({ createdAt: -1 }).limit(200)
    const unreadCount = await Notification.countDocuments({ user: req.user.id, read: false })
    res.json({ notifications: items, unreadCount })
  } catch (err) {
    next(err)
  }
}

export async function markNotificationRead(req, res, next) {
  try {
    const { id } = req.params
    const n = await Notification.findOne({ _id: id, user: req.user.id })
    if (!n) return res.status(404).json({ message: 'Not found' })
    if (!n.read) {
      n.read = true
      await n.save()
    }
    res.json({ notification: n })
  } catch (err) {
    next(err)
  }
}

export async function markAllRead(req, res, next) {
  try {
    await Notification.updateMany({ user: req.user.id, read: false }, { $set: { read: true } })
    res.json({ message: 'All read' })
  } catch (err) {
    next(err)
  }
}

export async function getUnreadCount(req, res, next) {
  try {
    const unreadCount = await Notification.countDocuments({ user: req.user.id, read: false })
    res.json({ unreadCount })
  } catch (err) {
    next(err)
  }
}

export async function deleteMyNotification(req, res, next) {
  try {
    const { id } = req.params
    const deleted = await Notification.findOneAndDelete({ _id: id, user: req.user.id })
    if (!deleted) return res.status(404).json({ message: 'Not found' })
    res.json({ message: 'Deleted' })
  } catch (err) {
    next(err)
  }
}


