import User from '../models/User.js'

export async function listUsers(req, res, next) {
  try {
    const users = await User.find().select('_id name email role isEmailVerified createdAt')
    res.json(users)
  } catch (err) {
    next(err)
  }
}

export async function updateUserRole(req, res, next) {
  try {
    const { id } = req.params
    const { role } = req.body
    const allowed = ['user', 'staff', 'volunteer', 'doctor', 'co_admin', 'admin']
    if (!allowed.includes(role)) return res.status(400).json({ message: 'Invalid role' })

    // Only admin and co_admin are allowed by route guard, but ensure that here as well
    const updated = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('_id name email role isEmailVerified')

    if (!updated) return res.status(404).json({ message: 'User not found' })
    res.json(updated)
  } catch (err) {
    next(err)
  }
}


