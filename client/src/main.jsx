import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { api } from './api.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

// Bootstrap CSRF token once on app start
;(async () => {
  try {
    const res = await fetch('/api/csrf-token', { credentials: 'include' })
    const data = await res.json().catch(() => ({}))
    if (data?.csrfToken) localStorage.setItem('pb:csrf', data.csrfToken)
  } catch {}
})()
