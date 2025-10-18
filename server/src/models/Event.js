import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    date: { type: Date, required: true, index: true },
    location: { type: String, required: true, trim: true },
    type: { 
      type: String, 
      enum: ['health', 'education', 'community', 'testing', 'workshop', 'seminar', 'other'], 
      default: 'community' 
    },
    status: { 
      type: String, 
      enum: ['draft', 'published', 'cancelled'], 
      default: 'published',
      index: true 
    },
    isRecurring: { type: Boolean, default: false },
    recurringPattern: { 
      type: String, 
      enum: ['daily', 'weekly', 'monthly', 'yearly'], 
      default: null 
    },
    maxAttendees: { type: Number, default: null },
    currentAttendees: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imageUrl: { type: String, default: '' },
    contactInfo: { type: String, default: '' },
    requirements: { type: String, default: '' },
  },
  { timestamps: true }
)

// Indexes for better query performance
eventSchema.index({ date: 1, status: 1 })
eventSchema.index({ status: 1, date: 1 })
eventSchema.index({ type: 1, date: 1 })
eventSchema.index({ createdBy: 1, date: 1 })

const Event = mongoose.model('Event', eventSchema)

export default Event
