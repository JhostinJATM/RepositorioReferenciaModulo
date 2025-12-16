/**
 * Store de Estudiantes de Vinculación - Estado global
 */
import { create } from 'zustand'
import { EstudianteVinculacionService } from '../api'

const useEstudianteVinculacionStore = create((set, get) => ({
  // Estado
  estudiantes: [],
  estudianteSeleccionado: null,
  loading: false,
  error: null,
  filtros: { search: '', page: 1, pageSize: 10 },
  totalItems: 0,

  // Acciones
  setFiltros: (filtros) => set((state) => ({ 
    filtros: { ...state.filtros, ...filtros } 
  })),

  setEstudianteSeleccionado: (estudiante) => set({ estudianteSeleccionado: estudiante }),

  clearEstudianteSeleccionado: () => set({ estudianteSeleccionado: null }),

  fetchEstudiantes: async () => {
    set({ loading: true, error: null })
    try {
      const response = await EstudianteVinculacionService.getAll(get().filtros)
      // El servicio devuelve el body directo, no envuelve en "data"
      let estudiantes = response?.results || response || []

      // Normalizar a arreglo y descartar entradas undefined/null
      if (!Array.isArray(estudiantes)) {
        estudiantes = []
      } else {
        estudiantes = estudiantes.filter(Boolean)
      }
      
      // Asegurar que todos tengan campos básicos (valores por defecto)
      estudiantes = estudiantes.map(e => ({
        ...e,
        nombre: e.nombre || '',
        apellido: e.apellido || '',
        dni: e.dni || '',
        email: e.email || '',
        telefono: e.telefono || '',
        direccion: e.direccion || ''
      }))
      
      // Enriquecer con datos de persona del user_module si faltan email o dni
      try {
        const { default: UserModuleService } = await import('../api/userModuleService')
        estudiantes = await Promise.all(
          estudiantes.map(async (estudiante) => {
            // Si no tiene email o no tiene DNI, buscar datos de persona
            if (estudiante.dni && estudiante.email) {
              return estudiante
            }
            
            try {
              // Buscar persona por external_id
              const personaData = await UserModuleService.buscarPorExternalId(estudiante.persona_external)
              if (personaData) {
                return {
                  ...estudiante,
                  nombre: personaData.first_name || '',
                  apellido: personaData.last_name || '',
                  dni: personaData.identification || '',
                  email: personaData.email || '',
                  telefono: personaData.phono || '',
                  direccion: personaData.direction || ''
                }
              }
            } catch (error) {
              console.error(`Error cargando datos de persona ${estudiante.persona_external}:`, error)
            }
            
            return estudiante
          })
        )
      } catch (error) {
        console.error('Error enriqueciendo datos de personas:', error)
      }
      
      set({ 
        estudiantes,
        totalItems: response.data?.count || 0,
        loading: false 
      })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  createEstudiante: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await EstudianteVinculacionService.create(data)
      set((state) => ({ 
        estudiantes: [...state.estudiantes, response.data],
        loading: false 
      }))
      return { success: true, data: response.data }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  updateEstudiante: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const response = await EstudianteVinculacionService.update(id, data)
      set((state) => ({
        estudiantes: state.estudiantes.map(e => e.id === id ? response.data : e),
        estudianteSeleccionado: null,
        loading: false
      }))
      return { success: true, data: response.data }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  deleteEstudiante: async (id) => {
    set({ loading: true, error: null })
    try {
      await EstudianteVinculacionService.delete(id)
      set((state) => ({
        estudiantes: state.estudiantes.filter(e => e.id !== id),
        loading: false
      }))
      return { success: true }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  reset: () => set({
    estudiantes: [],
    estudianteSeleccionado: null,
    loading: false,
    error: null,
    filtros: { search: '', page: 1, pageSize: 10 },
    totalItems: 0,
  }),
}))

export default useEstudianteVinculacionStore
