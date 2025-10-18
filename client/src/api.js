export async function apiRequest(path, { method = 'GET', body, headers = {}, signal } = {}) {
  // Attach CSRF token for state-changing requests if available
  const isStateChanging = method !== 'GET' && method !== 'HEAD'
  try {
    if (isStateChanging && !headers['X-CSRF-Token']) {
      const token = localStorage.getItem('pb:csrf')
      if (token) headers['X-CSRF-Token'] = token
    }
  } catch {}
  const res = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
    signal,
  })

  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await res.json().catch(() => ({})) : await res.text()

  if (!res.ok) {
    const message = (isJson && data && data.message) ? data.message : (typeof data === 'string' ? data : 'Request failed')
    const err = new Error(message)
    err.status = res.status
    err.data = data
    throw err
  }
  return data
}

export const api = {
  get: (path, options) => apiRequest(path, { ...options, method: 'GET' }),
  post: (path, body, options) => apiRequest(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => apiRequest(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options) => apiRequest(path, { ...options, method: 'PATCH', body }),
  del: (path, options) => apiRequest(path, { ...options, method: 'DELETE' }),
}


