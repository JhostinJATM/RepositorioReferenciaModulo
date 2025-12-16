/**
 * Componente Header - Barra superior
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiBell, FiUser, FiSettings, FiLogOut, FiChevronDown } from 'react-icons/fi'
import useAuthStore from '../stores/authStore'

const Header = () => {
  const navigate = useNavigate()
  const { user, role, logout } = useAuthStore()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getRoleLabel = (role) => {
    const roleMap = {
      'ADMIN': 'Administrador',
      'ENTRENADOR': 'Entrenador',
      'ESTUDIANTE_VINCULACION': 'Est. Vinculación',
    }
    return roleMap[role] || role
  }

  return (
    <header className="h-16 bg-white shadow-sm border-b border-gray-200">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Título o breadcrumb */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Sistema de Gestión - Basketball
          </h2>
        </div>

        {/* Acciones del header */}
        <div className="flex items-center space-x-4">
          {/* Notificaciones */}
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <FiBell className="w-5 h-5" />
          </button>
          
          {/* Configuración */}
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <FiSettings className="w-5 h-5" />
          </button>
          
          {/* Usuario con dropdown */}
          <div className="relative pl-4 border-l border-gray-200">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <FiUser className="w-4 h-4 text-primary-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-700">
                  {user?.sub || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500">
                  {getRoleLabel(role)}
                </p>
              </div>
              <FiChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.sub || 'Usuario'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {getRoleLabel(role)}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors"
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
