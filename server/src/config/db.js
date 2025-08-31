import mongoose from 'mongoose'

export async function connectToDatabase(mongoUri) {
  try {
    if (!mongoUri) {
      throw new Error('MONGO_URI not set in environment. Create .env and set MONGO_URI.')
    }

    await mongoose.connect(mongoUri)
    console.log('Connected to MongoDB')
    return true
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}


