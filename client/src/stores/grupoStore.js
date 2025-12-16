/**
 * Store de Grupos de Atletas - Estado global
 */
import { create } from 'zustand'
import { GrupoAtletaService } from '../api'

const useGrupoStore = create((set, get) => ({
  // Estado
  grupos: [],
  grupoSeleccionado: null,
  loading: false,
  error: null,
  filtros: { search: '', page: 1, pageSize: 10 },
  totalItems: 0,

  // Acciones
  setFiltros: (filtros) => set((state) => ({ 
    filtros: { ...state.filtros, ...filtros } 
  })),

  setGrupoSeleccionado: (grupo) => set({ grupoSeleccionado: grupo }),

  clearGrupoSeleccionado: () => set({ grupoSeleccionado: null }),

  fetchGrupos: async () => {
    set({ loading: true, error: null })
    try {
      const response = await GrupoAtletaService.getAll(get().filtros)
      let grupos = response?.results || response || []
      if (!Array.isArray(grupos)) {
        grupos = []
      } else {
        grupos = grupos.filter(Boolean)
      }

      set({ 
        grupos,
        totalItems: response?.count || 0,
        loading: false 
      })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  createGrupo: async (data) => {
    set({ loading: true, error: null })
    try {
      const payload = mapGrupoPayload(data)
      const response = await GrupoAtletaService.create(payload)
      // Asignar atletas si vienen
      if (data.atletas && data.atletas.length) {
        await GrupoAtletaService.asignarAtletas(response.id, data.atletas)
      }
      set((state) => ({ 
        grupos: [...state.grupos, response],
        loading: false 
      }))
      return { success: true, data: response }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  updateGrupo: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const payload = mapGrupoPayload(data)
      const response = await GrupoAtletaService.update(id, payload)
      if (data.atletas) {
        await GrupoAtletaService.asignarAtletas(id, data.atletas)
      }
      set((state) => ({
        grupos: state.grupos.map(g => g.id === id ? response : g),
        grupoSeleccionado: null,
        loading: false
      }))
      return { success: true, data: response }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  deleteGrupo: async (id) => {
    set({ loading: true, error: null })
    try {
      await GrupoAtletaService.delete(id)
      set((state) => ({
        grupos: state.grupos.filter(g => g.id !== id),
        loading: false
      }))
      return { success: true }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  reset: () => set({
    grupos: [],
    grupoSeleccionado: null,
    loading: false,
    error: null,
    filtros: { search: '', page: 1, pageSize: 10 },
    totalItems: 0,
  }),
}))

// Helpers
function mapGrupoPayload(data) {
  // Backend requiere: nombre, rango_edad_minima, rango_edad_maxima, categoria, descripcion, estado, entrenador
  return {
    nombre: data.nombre_grupo || data.nombre || '',
    rango_edad_minima: data.rango_edad_minima ?? 0,
    rango_edad_maxima: data.rango_edad_maxima ?? 99,
    categoria: data.categoria || '',
    descripcion: data.descripcion || '',
    estado: data.estado ?? true,
    entrenador: data.entrenador ?? 13, // entrenador demo (id 13) creado para pruebas
    atletas: data.atletas || [],
  }
}

export default useGrupoStore
