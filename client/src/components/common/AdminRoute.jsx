import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export default function AdminRoute() {
  const { user } = useSelector((s) => s.auth)
  if (!user)             return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />
  return <Outlet />
}
