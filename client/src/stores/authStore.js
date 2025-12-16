import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { jwtDecode } from 'jwt-decode'

const mapStamentToRole = (stament) => {
  if (!stament) return null
  const normalized = stament.toUpperCase()
  switch (normalized) {
    case 'ADMINISTRATIVOS':
      return 'ADMIN'
    case 'DOCENTES':
      return 'DOCENTE'
    case 'ESTUDIANTES':
      return 'ESTUDIANTE'
    case 'TRABAJADORES':
      return 'TRABAJADOR'
    case 'EXTERNOS':
      return 'EXTERNO'
    default:
      return null
  }
}

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      role: null,
      isAuthenticated: false,

      setToken: (token, userData = null) => {
        if (!token) {
          set({ token: null, user: null, role: null, isAuthenticated: false })
          return
        }

        const normalizedToken = token.startsWith('Bearer ')
          ? token.replace(/^Bearer\s+/, '')
          : token

        const parts = normalizedToken.split('.')
        const looksJwt = parts.length === 3

        try {
          if (looksJwt) {
            const decoded = jwtDecode(normalizedToken)
            const role = decoded.role || mapStamentToRole(decoded.stament) || 'GUEST'

            set({
              token: normalizedToken,
              user: decoded,
              role,
              isAuthenticated: true
            })
            return
          }

          // Token no JWT: guardamos lo que venga en userData
          const role = mapStamentToRole(userData?.stament) || userData?.role || 'GUEST'
          set({
            token: normalizedToken,
            user: userData,
            role,
            isAuthenticated: true
          })
        } catch (error) {
          console.error('Error decodificando token:', error)
          set({ token: null, user: null, role: null, isAuthenticated: false })
        }
      },

      logout: () => {
        set({ 
          token: null, 
          user: null, 
          role: null, 
          isAuthenticated: false 
        })
      },

      hasRole: (allowedRoles) => {
        const { role } = get()
        if (!role) return false
        if (Array.isArray(allowedRoles)) {
          return allowedRoles.includes(role)
        }
        return role === allowedRoles
      }
    }),
    {
      name: 'auth-storage',
    }
  )
)

export default useAuthStore
