import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export default function PrivateRoute() {
  const { user } = useSelector((s) => s.auth)
  const location = useLocation()
  return user
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location }} replace />
}
