import axios from 'axios'

// In development, this stays empty and Vite's proxy (vite.config.js) forwards
// /api requests to localhost:5000. In production (Vercel), VITE_API_URL is set
// to the live Render backend URL so requests go there directly.
const baseURL = `${import.meta.env.VITE_API_URL || ''}/api`

const api = axios.create({ baseURL })

// Attach JWT token automatically to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ejToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally — clear session and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ejToken')
      localStorage.removeItem('ejUser')
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
