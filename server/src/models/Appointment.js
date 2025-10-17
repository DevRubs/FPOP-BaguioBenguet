import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    clientName: { type: String, default: '' },
    type: { type: String, enum: ['counseling', 'checkup', 'followup'], required: true },
    startAt: { type: Date, required: true, index: true },
    location: { type: String, required: true },
    phone: { type: String, default: '' },
    notes: { type: String, default: '' },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending', index: true },
  },
  { timestamps: true }
)

appointmentSchema.index({ user: 1, startAt: 1 })

const Appointment = mongoose.model('Appointment', appointmentSchema)

export default Appointment



