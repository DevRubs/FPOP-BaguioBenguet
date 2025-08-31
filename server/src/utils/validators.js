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


