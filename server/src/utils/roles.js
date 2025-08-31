// Role hierarchy and permissions
// Higher index => higher privilege
export const ROLES = ['user', 'volunteer', 'doctor', 'staff', 'co_admin', 'admin']

export function hasAtLeastRole(userRole, requiredRole) {
  const a = ROLES.indexOf(userRole)
  const b = ROLES.indexOf(requiredRole)
  return a >= 0 && b >= 0 && a >= b
}

// Tab-level permissions derived from your matrix
// true => allowed, false => denied
export const TAB_PERMISSIONS = {
  Dashboard: { admin: true, co_admin: true, staff: true, doctor: true, volunteer: true, user: false },
  Users: { admin: true, co_admin: true, staff: false, doctor: false, volunteer: false, user: false },
  Homepage: { admin: true, co_admin: true, staff: false, doctor: false, volunteer: false, user: false },
  Resources: { admin: true, co_admin: true, staff: true, doctor: true, volunteer: true, user: false },
  Chat: { admin: true, co_admin: true, staff: true, doctor: true, volunteer: true, user: false },
  Schedule: { admin: true, co_admin: true, staff: true, doctor: true, volunteer: true, user: false },
  Volunteer: { admin: true, co_admin: true, staff: false, doctor: false, volunteer: false, user: false },
  About: { admin: true, co_admin: true, staff: false, doctor: false, volunteer: false, user: false },
  Youth: { admin: true, co_admin: true, staff: false, doctor: false, volunteer: false, user: false },
}

export const ALL_ROLES = ['admin', 'co_admin', 'staff', 'doctor', 'volunteer', 'user']

export function buildPermissionsTable() {
  const roles = ALL_ROLES
  const tabs = Object.keys(TAB_PERMISSIONS)
  const table = tabs.map(tab => {
    const row = { tab }
    for (const role of roles) {
      row[role] = Boolean(TAB_PERMISSIONS[tab][role])
    }
    return row
  })
  return { roles, tabs, table }
}

export function canRoleAccessTab(role, tab) {
  if (!TAB_PERMISSIONS[tab]) return false
  return Boolean(TAB_PERMISSIONS[tab][role])
}


