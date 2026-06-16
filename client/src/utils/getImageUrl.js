// Uploaded product images are served by the backend (Express static /uploads route),
// not the frontend. In development this is proxied automatically by Vite, but in
// production (frontend on Vercel, backend on Render) we need the full backend URL.
const API_BASE = import.meta.env.VITE_API_URL || ''

export const getImageUrl = (filename) => {
  if (!filename) return null
  // New uploads are full Cloudinary URLs (start with http) — use as-is.
  if (filename.startsWith('http')) return filename
  // Older/legacy images uploaded before the Cloudinary switch were stored as
  // plain filenames served from the backend's local /uploads folder.
  return `${API_BASE}/uploads/${filename}`
}
