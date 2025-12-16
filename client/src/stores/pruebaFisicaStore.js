/**
 * Store de Pruebas Físicas - Estado global
 */
import { create } from 'zustand'
import { PruebaFisicaService } from '../api'

const parseNumber = (value) => {
  if (value === null || value === undefined || value === '') return null
  const numeric = String(value).replace(',', '.').match(/-?\d+(?:\.\d+)?/)
  return numeric ? parseFloat(numeric[0]) : null
}

const mapResponse = (prueba) => ({
  id: prueba.id,
  atleta: prueba.atleta_id || prueba.atleta,
  atleta_nombre: prueba.atleta_nombre || prueba.atleta_nombre_completo || prueba.atleta_name,
  fecha_prueba: prueba.fecha_prueba || prueba.fecha_registro || '',
  tipo_prueba: prueba.tipo_prueba || '',
  nombre_prueba: prueba.nombre_prueba || prueba.tipo_prueba || '',
  resultado: prueba.resultado ?? '',
  unidad_medida: prueba.unidad_medida || '',
  valoracion: prueba.valoracion || '',
  observaciones: prueba.observaciones || '',
  estado: prueba.estado ?? true,
})

const mapPayload = (data) => {
  const parsedResultado = parseNumber(data.resultado)
  if (parsedResultado === null) {
    throw new Error('El resultado debe ser numérico')
  }

  return {
    atleta: data.atleta || data.atleta_id,
    atleta_id: data.atleta_id || data.atleta,
    fecha_registro: data.fecha_prueba || data.fecha_registro,
    tipo_prueba: data.tipo_prueba,
    nombre_prueba: data.nombre_prueba || data.tipo_prueba,
    resultado: parsedResultado,
    unidad_medida: data.unidad_medida || data.unidad || '',
    valoracion: data.valoracion || '',
    observaciones: data.observaciones || '',
    estado: data.estado ?? true,
  }
}

const usePruebaFisicaStore = create((set, get) => ({
  // Estado
  pruebas: [],
  pruebaSeleccionada: null,
  loading: false,
  error: null,
  filtros: { search: '', page: 1, pageSize: 10 },
  totalItems: 0,

  // Acciones
  setFiltros: (filtros) => set((state) => ({ 
    filtros: { ...state.filtros, ...filtros } 
  })),

  setPruebaSeleccionada: (prueba) => set({ pruebaSeleccionada: prueba }),

  clearPruebaSeleccionada: () => set({ pruebaSeleccionada: null }),

  fetchPruebas: async () => {
    set({ loading: true, error: null })
    try {
      const data = await PruebaFisicaService.getAll(get().filtros)
      const items = data?.results || data || []
      set({
        pruebas: Array.isArray(items) ? items.map(mapResponse) : [],
        totalItems: data?.count || 0,
        loading: false,
      })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  createPrueba: async (data) => {
    set({ loading: true, error: null })
    try {
      const payload = mapPayload(data)
      const created = await PruebaFisicaService.create(payload)
      set((state) => ({
        pruebas: [...state.pruebas, mapResponse(created)],
        loading: false,
      }))
      return { success: true, data: created }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  updatePrueba: async (id, data) => {
    set({ loading: true, error: null })
    try {
      const payload = mapPayload(data)
      const updated = await PruebaFisicaService.update(id, payload)
      set((state) => ({
        pruebas: state.pruebas.map(p => p.id === id ? mapResponse(updated) : p),
        pruebaSeleccionada: null,
        loading: false,
      }))
      return { success: true, data: updated }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  deletePrueba: async (id) => {
    set({ loading: true, error: null })
    try {
      await PruebaFisicaService.delete(id)
      set((state) => ({
        pruebas: state.pruebas.filter(p => p.id !== id),
        loading: false
      }))
      return { success: true }
    } catch (error) {
      set({ error: error.message, loading: false })
      return { success: false, error: error.message }
    }
  },

  reset: () => set({
    pruebas: [],
    pruebaSeleccionada: null,
    loading: false,
    error: null,
    filtros: { search: '', page: 1, pageSize: 10 },
    totalItems: 0,
  }),
}))

export default usePruebaFisicaStore
