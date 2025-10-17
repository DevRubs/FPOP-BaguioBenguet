import mongoose from 'mongoose'

const youthArchiveSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    url: { type: String, required: true, trim: true },
    note: { type: String, default: '', trim: true },
    platform: { 
      type: String, 
      enum: ['facebook', 'instagram', 'youtube', 'tiktok', 'twitter', 'other'], 
      default: 'other' 
    },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

youthArchiveSchema.index({ date: -1 })
youthArchiveSchema.index({ isActive: 1, date: -1 })
youthArchiveSchema.index({ platform: 1 })

const YouthArchive = mongoose.model('YouthArchive', youthArchiveSchema)

export default YouthArchive
