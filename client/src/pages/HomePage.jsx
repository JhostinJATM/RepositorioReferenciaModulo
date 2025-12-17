/**
 * Página de inicio - Dashboard
 */

import { Link } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import {
  FiUsers,
  FiUserCheck,
  FiLayers,
  FiClipboard,
  FiActivity,
  FiTarget,
  FiTrendingUp,
} from 'react-icons/fi'

const HomePage = () => {
  const { role, user } = useAuthStore()
  const isAdmin = role === 'ADMIN'

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Dashboard</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Bienvenido al sistema de gestión de Basketball</p>
      </div>

      {isAdmin ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Card 1: Atletas */}
            <div className="relative overflow-hidden rounded-2xl bg-[#A855F7] p-6 text-white shadow-lg transition-transform hover:-translate-y-1">
              <div className="flex justify-between items-start z-10 relative">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <FiUsers className="text-2xl" />
                </div>
                <span className="bg-white/20 px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm">+12%</span>
              </div>
              <div className="mt-4 z-10 relative">
                <h3 className="text-4xl font-bold">124</h3>
                <p className="text-sm font-medium opacity-90">Atletas Registrados</p>
              </div>
              <FiUsers className="absolute -bottom-4 -right-4 text-9xl text-white opacity-10 transform rotate-12" />
            </div>

            {/* Card 2: Entrenadores */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-400 to-green-500 p-6 text-white shadow-lg transition-transform hover:-translate-y-1">
              <div className="flex justify-between items-start z-10 relative">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <FiUserCheck className="text-2xl" />
                </div>
                <span className="bg-white/20 px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm">Activos</span>
              </div>
              <div className="mt-4 z-10 relative">
                <h3 className="text-4xl font-bold">8</h3>
                <p className="text-sm font-medium opacity-90">Entrenadores</p>
              </div>
              <FiUserCheck className="absolute -bottom-4 -right-4 text-9xl text-white opacity-10 transform rotate-12" />
            </div>

            {/* Card 3: Grupos */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-500 p-6 text-white shadow-lg transition-transform hover:-translate-y-1">
              <div className="flex justify-between items-start z-10 relative">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <FiLayers className="text-2xl" />
                </div>
                <span className="bg-white/20 px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm">Formativo</span>
              </div>
              <div className="mt-4 z-10 relative">
                <h3 className="text-4xl font-bold">12</h3>
                <p className="text-sm font-medium opacity-90">Grupos Activos</p>
              </div>
              <FiLayers className="absolute -bottom-4 -right-4 text-9xl text-white opacity-10 transform rotate-12" />
            </div>

            {/* Card 4: Inscripciones */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 p-6 text-white shadow-lg transition-transform hover:-translate-y-1">
              <div className="flex justify-between items-start z-10 relative">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <FiClipboard className="text-2xl" />
                </div>
                <span className="bg-white/20 px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm">5 Pendientes</span>
              </div>
              <div className="mt-4 z-10 relative">
                <h3 className="text-4xl font-bold">45</h3>
                <p className="text-sm font-medium opacity-90">Inscripciones</p>
              </div>
              <FiClipboard className="absolute -bottom-4 -right-4 text-9xl text-white opacity-10 transform rotate-12" />
            </div>

            {/* Card 5: P. Antropométricas */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-400 to-red-500 p-6 text-white shadow-lg transition-transform hover:-translate-y-1">
              <div className="flex justify-between items-start z-10 relative">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <FiActivity className="text-2xl" />
                </div>
              </div>
              <div className="mt-4 z-10 relative">
                <h3 className="text-4xl font-bold">0</h3>
                <p className="text-sm font-medium opacity-90">P. Antropométricas</p>
              </div>
              <FiActivity className="absolute -bottom-4 -right-4 text-9xl text-white opacity-10 transform rotate-12" />
            </div>

            {/* Card 6: Pruebas Físicas */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-500 p-6 text-white shadow-lg transition-transform hover:-translate-y-1">
              <div className="flex justify-between items-start z-10 relative">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <FiTarget className="text-2xl" />
                </div>
                <span className="bg-white/20 px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm">Completadas</span>
              </div>
              <div className="mt-4 z-10 relative">
                <h3 className="text-4xl font-bold">28</h3>
                <p className="text-sm font-medium opacity-90">Pruebas Físicas</p>
              </div>
              <FiTarget className="absolute -bottom-4 -right-4 text-9xl text-white opacity-10 transform rotate-12" />
            </div>
          </div>

          {/* Quick Access */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm mb-8">
            <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-6">Accesos Rápidos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link to="/atletas" className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center text-center h-32">
                <div className="bg-white/20 rounded-full p-2 mb-2 group-hover:scale-110 transition-transform backdrop-blur-sm">
                  <FiUsers className="text-2xl" />
                </div>
                <span className="font-semibold text-sm">Nuevo Atleta</span>
                <FiUsers className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-10" />
              </Link>
              <Link to="/inscripciones" className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center text-center h-32">
                <div className="bg-white/20 rounded-full p-2 mb-2 group-hover:scale-110 transition-transform backdrop-blur-sm">
                  <FiClipboard className="text-2xl" />
                </div>
                <span className="font-semibold text-sm">Nueva Inscripción</span>
                <FiClipboard className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-10" />
              </Link>
              <Link to="/pruebas-antropometricas" className="group relative overflow-hidden bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center text-center h-32">
                <div className="bg-white/20 rounded-full p-2 mb-2 group-hover:scale-110 transition-transform backdrop-blur-sm">
                  <FiActivity className="text-2xl" />
                </div>
                <span className="font-semibold text-sm">Registrar Prueba</span>
                <FiActivity className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-10" />
              </Link>
              <Link to="/grupos" className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-md hover:shadow-lg transition-all flex flex-col items-center justify-center text-center h-32">
                <div className="bg-white/20 rounded-full p-2 mb-2 group-hover:scale-110 transition-transform backdrop-blur-sm">
                  <FiLayers className="text-2xl" />
                </div>
                <span className="font-semibold text-sm">Ver Grupos</span>
                <FiLayers className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl opacity-10" />
              </Link>
            </div>
          </div>

          {/* Recent Registrations Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">Inscripciones Recientes</h3>
              <Link to="/inscripciones" className="text-[#8B5CF6] text-sm font-semibold hover:underline">Ver todas</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead className="bg-gray-50 dark:bg-gray-700/50 uppercase text-xs font-semibold text-gray-500 dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-4">Atleta</th>
                    <th className="px-6 py-4">Grupo</th>
                    <th className="px-6 py-4">Fecha</th>
                    <th className="px-6 py-4">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">Juan Pérez</td>
                    <td className="px-6 py-4">Sub-16 Masculino</td>
                    <td className="px-6 py-4">24 Oct, 2023</td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded text-xs font-semibold">Completado</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">Maria Gonzalez</td>
                    <td className="px-6 py-4">Femenino A</td>
                    <td className="px-6 py-4">23 Oct, 2023</td>
                    <td className="px-6 py-4">
                      <span className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-1 rounded text-xs font-semibold">Pendiente</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800 dark:text-white">Carlos Ruiz</td>
                    <td className="px-6 py-4">Sub-14 Mixto</td>
                    <td className="px-6 py-4">22 Oct, 2023</td>
                    <td className="px-6 py-4">
                      <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded text-xs font-semibold">Completado</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="h-4 bg-gray-50 dark:bg-gray-800"></div>
          </div>
        </>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Bienvenido, {user?.username}</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Usa el menú lateral para acceder a tus módulos asignados.
          </p>
        </div>
      )}
    </div>
  )
}

export default HomePage
