/**
 * Componente Header - Barra superior
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
    <header className="h-20 bg-white dark:bg-gray-800 flex items-center justify-between px-8 shadow-sm z-10 transition-colors duration-300">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Sistema de Gestión - Basketball</h2>
      
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <button className="text-gray-500 dark:text-gray-400 hover:text-[#8B5CF6] transition-colors relative">
          <span className="material-icons-outlined">notifications</span>
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white dark:ring-gray-800 bg-red-500"></span>
        </button>
        
        {/* Settings */}
        <button className="text-gray-500 dark:text-gray-400 hover:text-[#8B5CF6] transition-colors">
          <span className="material-icons-outlined">settings</span>
        </button>
        
        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center pl-6 border-l border-gray-200 dark:border-gray-700 focus:outline-none"
          >
            <div className="text-right mr-3 hidden sm:block">
              <p className="text-sm font-semibold text-gray-800 dark:text-white">{user?.username || 'Usuario'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{getRoleLabel(role)}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 flex items-center justify-center">
              <span className="material-icons-round">person</span>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-20">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 sm:hidden">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.username || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {getRoleLabel(role)}
                  </p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-2 transition-colors"
                >
                  <span className="material-icons-outlined text-sm">logout</span>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
