import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'staff', 'volunteer', 'doctor', 'co_admin', 'admin'], default: 'user' },
    passwordResetToken: { type: String, default: null },
    passwordResetExpires: { type: Date, default: null },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String, default: null },
    emailVerificationExpires: { type: Date, default: null },
    tokenVersion: { type: Number, default: 0 },
    // Abuse controls
    loginFailedAttempts: { type: Number, default: 0 },
    loginBlockedUntil: { type: Date, default: null },
    verifyFailedAttempts: { type: Number, default: 0 },
    verifyBlockedUntil: { type: Date, default: null },
  },
  { timestamps: true }
)

// Speed up verification lookups
userSchema.index({ emailVerificationToken: 1, emailVerificationExpires: 1 })
userSchema.index({ loginBlockedUntil: 1 })
userSchema.index({ verifyBlockedUntil: 1 })

const User = mongoose.model('User', userSchema)

export default User


