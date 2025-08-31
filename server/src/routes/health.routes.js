import { Router } from 'express'
import mongoose from 'mongoose'

const router = Router()

router.get('/', (req, res) => {
  const dbReadyStates = ['disconnected', 'connected', 'connecting', 'disconnecting']
  const dbState = dbReadyStates[mongoose.connection.readyState] || 'unknown'
  res.json({ status: 'ok', db: dbState, timestamp: new Date().toISOString() })
})

export default router


