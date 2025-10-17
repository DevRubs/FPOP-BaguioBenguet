import mongoose from 'mongoose'

const volunteerApplicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    age: { type: Number, min: 12, max: 120 },
    city: { type: String, default: '', trim: true },
    availability: { type: String, default: '' },
    skills: { type: [String], default: [] },
    motivation: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'withdrawn'], default: 'pending', index: true },
  },
  { timestamps: true }
)

volunteerApplicationSchema.index({ user: 1, createdAt: -1 })
volunteerApplicationSchema.index({ status: 1, city: 1 })

const VolunteerApplication = mongoose.model('VolunteerApplication', volunteerApplicationSchema)

export default VolunteerApplication


