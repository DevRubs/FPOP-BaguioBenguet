import dotenv from 'dotenv'
import app from './app.js'
import { connectToDatabase } from './config/db.js'

dotenv.config()

const port = process.env.PORT || 5000
const mongoUri = process.env.MONGO_URI

async function start() {
  try {
    await connectToDatabase(mongoUri)
    // Startup env checks
    const required = ['JWT_SECRET']
    const missing = required.filter((k) => !process.env[k])
    if (missing.length) {
      console.warn('Warning: Missing env vars:', missing.join(', '))
    }

    // Daily cleanup job: remove unverified users older than 30 days
    setInterval(async () => {
      try {
        const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        const res = await (await import('./models/User.js')).default.deleteMany({ isEmailVerified: false, createdAt: { $lt: cutoff } })
        if (res.deletedCount) {
          console.log(`[cleanup] Removed ${res.deletedCount} unverified accounts older than 30 days`)
        }
      } catch (e) {
        console.error('[cleanup] Failed:', e.message)
      }
    }, 24 * 60 * 60 * 1000)

    app.listen(port, () => {
      console.log(`Server listening on http://localhost:${port}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

start()


