import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, hasRole } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/" replace /> // O a una página de "No autorizado"
  }

  return <Outlet />
}

export default ProtectedRoute
