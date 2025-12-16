/**
 * Store de Entrenadores - Estado global
 */
import { create } from 'zustand'
import { EntrenadorService } from '../api'

const useEntrenadorStore = create((set, get) => ({
  // Estado
  entrenadores: [],
  entrenadorSeleccionado: null,
  loading: false,
  error: null,
  filtros: { search: '', page: 1, pageSize: 10 },
  totalItems: 0,

  // Acciones
  setFiltros: (filtros) => set((state) => ({ 
    filtros: { ...state.filtros, ...filtros } 
  })),

  setEntrenadorSeleccionado: (entrenador) => set({ entrenadorSeleccionado: entrenador }),

  clearEntrenadorSeleccionado: () => set({ entrenadorSeleccionado: null }),

  fetchEntrenadores: async () => {
    set({ loading: true, error: null })
    try {
      const response = await EntrenadorService.getAll(get().filtros)
      // El servicio ya devuelve el body de la API, no viene anidado en "data"
      let entrenadores = response?.results || response || []

      // Normalizar a arreglo y descartar entradas undefined/null
      if (!Array.isArray(entrenadores)) {
        entrenadores = []
      } else {
        entrenadores = entrenadores.filter(Boolean)
      }
      
      // Asegurar que todos tengan campos básicos (valores por defecto)
      entrenadores = entrenadores.map(e => ({
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
        entrenadores = await Promise.all(
          entrenadores.map(async (entrenador) => {
            // Si no tiene email o no tiene DNI, buscar datos de persona
            if (entrenador.dni && entrenador.email) {
              return entrenador
            }
            
            try {
              // Buscar persona por external_id
              const personaData = await UserModuleService.buscarPorExternalId(entrenador.persona_external)
              if (personaData) {
                return {
                  ...entrenador,
                  nombre: personaData.first_name || '',
                  apellido: personaData.last_name || '',
                  dni: personaData.identification || '',
                  email: personaData.email || '',
                  telefono: personaData.phono || '',
                  direccion: personaData.direction || ''
                }
              }
            } catch (error) {
              console.error(`Error cargando datos de persona ${entrenador.persona_external}:`, error)
            }
            
            return entrenador
          })
        )
      } catch (error) {
        console.error('Error enriqueciendo datos de personas:', error)
      }
      
      set({ 
        entrenadores,
        totalItems: response.data?.count || 0,
        loading: false 
      })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  createEntrenador: async (data) => {
    set({ loading: true, error: null })
    try {
      const response = await EntrenadorService.create(data)
      set((state) => ({ 
        entrenadores: [...state.entrenadores, response.data],
        loading: false 
      }))
      return { success: true, data: response.data }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  updateEntrenador: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const response = await EntrenadorService.update(id, data)
      set((state) => ({
        entrenadores: state.entrenadores.map(e => e.id === id ? response.data : e),
        entrenadorSeleccionado: null,
        loading: false
      }))
      return { success: true, data: response.data }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  deleteEntrenador: async (id) => {
    set({ loading: true, error: null })
    try {
      await EntrenadorService.delete(id)
      set((state) => ({
        entrenadores: state.entrenadores.filter(e => e.id !== id),
        loading: false
      }))
      return { success: true }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  reset: () => set({
    entrenadores: [],
    entrenadorSeleccionado: null,
    loading: false,
    error: null,
    filtros: { search: '', page: 1, pageSize: 10 },
    totalItems: 0,
  }),
}))

export default useEntrenadorStore
