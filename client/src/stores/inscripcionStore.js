/**
 * Store de Inscripciones - Estado global
 */
import { create } from 'zustand'
import { InscripcionService } from '../api'

const mapResponse = (ins) => ({
  id: ins.id,
  atleta: ins.atleta_id || ins.atleta,
  atleta_nombre: ins.atleta_nombre || ins.atleta_name || '',
  fecha_inscripcion: ins.fecha_inscripcion || '',
  tipo_inscripcion: ins.tipo_inscripcion || '',
  observaciones: ins.observaciones || '',
  habilitada: ins.habilitada ?? true,
  registrado_por: ins.registrado_por || '',
})

const mapPayload = (data) => ({
  atleta: data.atleta || data.atleta_id,
  atleta_id: data.atleta_id || data.atleta,
  fecha_inscripcion: data.fecha_inscripcion,
  tipo_inscripcion: data.tipo_inscripcion,
  observaciones: data.observaciones || '',
  habilitada: data.habilitada ?? true,
  registrado_por: data.registrado_por || '',
})

const useInscripcionStore = create((set, get) => ({
  // Estado
  inscripciones: [],
  inscripcionSeleccionada: null,
  loading: false,
  error: null,
  filtros: { search: '', page: 1, pageSize: 10 },
  totalItems: 0,

  // Acciones
  setFiltros: (filtros) => set((state) => ({ 
    filtros: { ...state.filtros, ...filtros } 
  })),

  setInscripcionSeleccionada: (inscripcion) => set({ inscripcionSeleccionada: inscripcion }),

  clearInscripcionSeleccionada: () => set({ inscripcionSeleccionada: null }),

  fetchInscripciones: async () => {
    set({ loading: true, error: null })
    try {
      const data = await InscripcionService.getAll(get().filtros)
      const items = data?.results || data || []
      set({
        inscripciones: Array.isArray(items) ? items.map(mapResponse) : [],
        totalItems: data?.count || 0,
        loading: false,
      })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  createInscripcion: async (data) => {
    set({ loading: true, error: null })
    try {
      const payload = mapPayload(data)
      const created = await InscripcionService.create(payload)
      set((state) => ({
        inscripciones: [...state.inscripciones, mapResponse(created)],
        loading: false,
      }))
      return { success: true, data: created }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  updateInscripcion: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const payload = mapPayload(data)
      const updated = await InscripcionService.update(id, payload)
      set((state) => ({
        inscripciones: state.inscripciones.map(i => i.id === id ? mapResponse(updated) : i),
        inscripcionSeleccionada: null,
        loading: false,
      }))
      return { success: true, data: updated }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  deleteInscripcion: async (id) => {
    set({ loading: true, error: null })
    try {
      await InscripcionService.delete(id)
      set((state) => ({
        inscripciones: state.inscripciones.filter(i => i.id !== id),
        loading: false
      }))
      return { success: true }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  reset: () => set({
    inscripciones: [],
    inscripcionSeleccionada: null,
    loading: false,
    error: null,
    filtros: { search: '', page: 1, pageSize: 10 },
    totalItems: 0,
  }),
}))

export default useInscripcionStore
