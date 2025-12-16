/**
 * Componente Sidebar - Menú lateral de navegación
 */

import { NavLink } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import {
  FiHome,
  FiUsers,
  FiUserCheck,
  FiLayers,
  FiClipboard,
  FiActivity,
  FiTarget,
  FiBookOpen,
} from 'react-icons/fi'

const menuItems = [
  { path: '/', icon: FiHome, label: 'Inicio', roles: [] }, // Visible para todos
  { path: '/atletas', icon: FiUsers, label: 'Atletas', roles: ['ADMIN', 'DOCENTE', 'ESTUDIANTE'] },
  { path: '/entrenadores', icon: FiUserCheck, label: 'Entrenadores', roles: ['ADMIN'] },
  { path: '/grupos', icon: FiLayers, label: 'Grupos', roles: ['ADMIN', 'DOCENTE'] },
  { path: '/inscripciones', icon: FiClipboard, label: 'Inscripciones', roles: ['ADMIN', 'DOCENTE'] },
  { path: '/pruebas-antropometricas', icon: FiActivity, label: 'Pruebas Antropométricas', roles: ['ADMIN', 'DOCENTE', 'ESTUDIANTE'] },
  { path: '/pruebas-fisicas', icon: FiTarget, label: 'Pruebas Físicas', roles: ['ADMIN', 'DOCENTE', 'ESTUDIANTE'] },
  { path: '/estudiantes-vinculacion', icon: FiBookOpen, label: 'Est. Vinculación', roles: ['ADMIN'] },
]

const Sidebar = () => {
  const { hasRole } = useAuthStore()

  return (
    <aside className="w-64 bg-white shadow-lg">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <h1 className="text-xl font-bold text-primary-600">🏀 Basketball</h1>
      </div>
      
      {/* Navegación */}
      <nav className="mt-6 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            // Si roles está vacío, es público. Si no, verificamos permisos.
            if (item.roles.length > 0 && !hasRole(item.roles)) {
              return null
            }

            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
