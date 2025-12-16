/**
 * Store de Atletas - Estado global de atletas
 * Maneja: lista, filtros, atleta seleccionado
 */
import { create } from 'zustand'
import { AtletaService } from '../api'

const useAtletaStore = create((set, get) => ({
  // Estado
  atletas: [],
  atletaSeleccionado: null,
  loading: false,
  error: null,
  
  // Filtros y paginación
  filtros: {
    search: '',
    page: 1,
    pageSize: 10,
  },
  totalItems: 0,

  // Acciones
  setFiltros: (filtros) => set((state) => ({ 
    filtros: { ...state.filtros, ...filtros } 
  })),

  setAtletaSeleccionado: (atleta) => set({ atletaSeleccionado: atleta }),

  clearAtletaSeleccionado: () => set({ atletaSeleccionado: null }),

  // Fetch atletas
  fetchAtletas: async () => {
    set({ loading: true, error: null })
    try {
      const response = await AtletaService.getAll(get().filtros)
      let atletas = response?.results || response || []

      if (!Array.isArray(atletas)) {
        atletas = []
      } else {
        atletas = atletas.filter(Boolean).map((a) => ({
          categoria: '', // el modelo no tiene categoría; dejar string vacío para la tabla
          ...a,
        }))
      }

      set({ 
        atletas,
        totalItems: response?.count || 0,
        loading: false 
      })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  // Crear atleta
  createAtleta: async (data) => {
    set({ loading: true, error: null })
    try {
      const payload = mapAtletaPayload(data)
      const response = await AtletaService.create(payload)
      set((state) => ({ 
        atletas: [...state.atletas, response],
        loading: false 
      }))
      return { success: true, data: response }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  // Actualizar atleta
  updateAtleta: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const payload = mapAtletaPayload(data)
      const response = await AtletaService.update(id, payload)
      set((state) => ({
        atletas: state.atletas.map(a => a.id === id ? response : a),
        atletaSeleccionado: null,
        loading: false
      }))
      return { success: true, data: response }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  // Eliminar atleta
  deleteAtleta: async (id) => {
    set({ loading: true, error: null })
    try {
      await AtletaService.delete(id)
      set((state) => ({
        atletas: state.atletas.filter(a => a.id !== id),
        loading: false
      }))
      return { success: true }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  // Reset store
  reset: () => set({
    atletas: [],
    atletaSeleccionado: null,
    loading: false,
    error: null,
    filtros: { search: '', page: 1, pageSize: 10 },
    totalItems: 0,
  }),
}))

// Helpers
function mapAtletaPayload(data) {
  // Calcular edad a partir de fecha_nacimiento si está presente
  let edad = data.edad
  if (!edad && data.fecha_nacimiento) {
    try {
      const nacimiento = new Date(data.fecha_nacimiento)
      const hoy = new Date()
      let years = hoy.getFullYear() - nacimiento.getFullYear()
      const m = hoy.getMonth() - nacimiento.getMonth()
      if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
        years--
      }
      edad = years
    } catch (e) {
      edad = null
    }
  }

  return {
    nombre_atleta: data.nombre_atleta || '',
    apellido_atleta: data.apellido_atleta || '',
    dni: data.dni || '',
    fecha_nacimiento: data.fecha_nacimiento || null,
    edad: edad ?? null,
    sexo: data.sexo || '',
    email: data.email || '',
    telefono: data.telefono || '',
    tipo_sangre: data.tipo_sangre || '',
    datos_representante: data.contacto_emergencia || '',
    telefono_representante: data.telefono_emergencia || '',
    foto: data.foto || '',
  }
}

export default useAtletaStore
