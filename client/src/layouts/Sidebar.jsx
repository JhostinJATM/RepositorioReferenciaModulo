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
  FiShare2,
} from 'react-icons/fi'

const menuItems = [
  { path: '/home', icon: FiHome, label: 'Dashboard', roles: [] }, // Visible para todos
  { path: '/atletas', icon: FiUsers, label: 'Atletas', roles: ['ADMIN', 'ENTRENADOR', 'ESTUDIANTE_VINCULACION'] },
  { path: '/entrenadores', icon: FiUserCheck, label: 'Entrenadores', roles: ['ADMIN'] },
  { path: '/grupos', icon: FiLayers, label: 'Grupos', roles: ['ADMIN', 'ENTRENADOR'] },
  { path: '/grupo-atletas', icon: FiShare2, label: 'Asignar Atletas', roles: ['ADMIN', 'ENTRENADOR'] },
  { path: '/inscripciones', icon: FiClipboard, label: 'Inscripciones', roles: ['ADMIN', 'ENTRENADOR'] },
  { path: '/pruebas-antropometricas', icon: FiActivity, label: 'P. Antropométricas', roles: ['ADMIN', 'ENTRENADOR', 'ESTUDIANTE_VINCULACION'] },
  { path: '/pruebas-fisicas', icon: FiTarget, label: 'Pruebas Físicas', roles: ['ADMIN', 'ENTRENADOR', 'ESTUDIANTE_VINCULACION'] },
  { path: '/estudiantes-vinculacion', icon: FiBookOpen, label: 'Est. Vinculación', roles: ['ADMIN'] },
]

const Sidebar = () => {
  const { hasRole, user, logout } = useAuthStore()

  return (
    <aside className="w-64 bg-[#1F2235] dark:bg-[#111827] flex-shrink-0 flex flex-col transition-colors duration-300 overflow-y-auto scrollbar-hide">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-gray-700/50">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mr-3">
          <span className="material-icons-outlined text-white text-lg">sports_basketball</span>
        </div>
        <h1 className="text-white text-lg font-bold tracking-wide">Basketball <span className="text-[#8B5CF6] text-sm font-normal">Sys</span></h1>
      </div>
      
      {/* Navegación */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          // Si roles está vacío, es público. Si no, verificamos permisos.
          if (item.roles.length > 0 && !hasRole(item.roles)) {
            return null
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-[#8B5CF6] text-white shadow-lg shadow-purple-500/30 scale-[1.02]'
                    : 'text-gray-400 hover:text-white hover:bg-[#2D3045]'
                }`
              }
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* User Profile / Logout */}
      <div className="p-4 border-t border-gray-700/50">
        <button 
          onClick={logout}
          className="flex items-center w-full p-2 rounded-lg hover:bg-[#2D3045] transition-colors group text-left"
        >
          <div className="w-10 h-10 rounded-full bg-indigo-900 flex items-center justify-center text-indigo-300 font-bold mr-3 group-hover:bg-indigo-800">
            {user?.username?.substring(0, 2).toUpperCase() || 'US'}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{user?.username || 'Usuario'}</p>
            <p className="text-xs text-gray-500 group-hover:text-gray-400">Cerrar Sesión</p>
          </div>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
