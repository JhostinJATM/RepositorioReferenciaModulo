/**
 * Store de Pruebas Antropométricas - Estado global
 */
import { create } from 'zustand'
import { PruebaAntropometricaService } from '../api'

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
  peso: prueba.peso ?? '',
  altura: prueba.altura ?? prueba.estatura ?? '',
  estatura: prueba.estatura ?? prueba.altura ?? '',
  altura_sentado: prueba.altura_sentado ?? '',
  envergadura: prueba.envergadura ?? '',
  indice_masa_corporal: prueba.indice_masa_corporal ?? '',
  indice_cornico: prueba.indice_cornico ?? '',
  porcentaje_grasa: prueba.porcentaje_grasa ?? '',
  observaciones: prueba.observaciones || '',
  estado: prueba.estado ?? true,
})

const mapPayload = (data) => {
  const peso = parseNumber(data.peso)
  const estatura = parseNumber(data.altura ?? data.estatura)

  if (peso === null || estatura === null) {
    throw new Error('Peso y estatura deben ser numéricos')
  }

  return {
    atleta: data.atleta || data.atleta_id,
    atleta_id: data.atleta_id || data.atleta,
    fecha_registro: data.fecha_prueba || data.fecha_registro,
    peso,
    estatura,
    altura_sentado: parseNumber(data.altura_sentado),
    envergadura: parseNumber(data.envergadura),
    indice_masa_corporal: parseNumber(data.indice_masa_corporal),
    indice_cornico: parseNumber(data.indice_cornico),
    porcentaje_grasa: parseNumber(data.porcentaje_grasa),
    observaciones: data.observaciones || '',
    estado: data.estado ?? true,
  }
}

const usePruebaAntropometricaStore = create((set, get) => ({
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
      const data = await PruebaAntropometricaService.getAll(get().filtros)
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
      const created = await PruebaAntropometricaService.create(payload)
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
      const updated = await PruebaAntropometricaService.update(id, payload)
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
      await PruebaAntropometricaService.delete(id)
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

export default usePruebaAntropometricaStore
