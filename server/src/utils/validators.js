export function isValidEmail(email) {
  if (!email) return false
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(email).toLowerCase())
}

export function isStrongPassword(password) {
  if (!password || password.length < 8) return false
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-\[\]\\/;'+=~`]/.test(password)
  return hasUpper && hasLower && hasNumber && hasSpecial
}

export function validateEventData(eventData, isUpdate = false) {
  const requiredFields = ['title', 'date', 'location']
  const validTypes = ['health', 'education', 'community', 'testing', 'workshop', 'seminar', 'other']
  const validStatuses = ['draft', 'published', 'cancelled']
  const validRecurringPatterns = ['daily', 'weekly', 'monthly', 'yearly']

  // Check required fields for creation
  if (!isUpdate) {
    for (const field of requiredFields) {
      if (!eventData[field]) {
        return { isValid: false, message: `${field} is required` }
      }
    }
  }

  // Validate title
  if (eventData.title !== undefined) {
    if (typeof eventData.title !== 'string' || eventData.title.trim().length < 3) {
      return { isValid: false, message: 'Title must be at least 3 characters long' }
    }
  }

  // Validate date
  if (eventData.date !== undefined) {
    const date = new Date(eventData.date)
    if (isNaN(date.getTime())) {
      return { isValid: false, message: 'Invalid date format' }
    }
    // Allow events for today and future dates
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) {
      return { isValid: false, message: 'Event date cannot be in the past' }
    }
  }

  // Validate location
  if (eventData.location !== undefined) {
    if (typeof eventData.location !== 'string' || eventData.location.trim().length < 3) {
      return { isValid: false, message: 'Location must be at least 3 characters long' }
    }
  }

  // Validate type
  if (eventData.type !== undefined && !validTypes.includes(eventData.type)) {
    return { isValid: false, message: 'Invalid event type' }
  }

  // Validate status
  if (eventData.status !== undefined && !validStatuses.includes(eventData.status)) {
    return { isValid: false, message: 'Invalid event status' }
  }

  // Validate recurring pattern
  if (eventData.recurringPattern !== undefined && eventData.recurringPattern !== null && !validRecurringPatterns.includes(eventData.recurringPattern)) {
    return { isValid: false, message: 'Invalid recurring pattern' }
  }

  // Validate maxAttendees
  if (eventData.maxAttendees !== undefined && eventData.maxAttendees !== null) {
    if (typeof eventData.maxAttendees !== 'number' || eventData.maxAttendees < 1) {
      return { isValid: false, message: 'Max attendees must be a positive number' }
    }
  }

  return { isValid: true }
}


