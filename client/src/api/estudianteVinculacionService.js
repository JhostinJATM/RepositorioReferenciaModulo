/**
 * Servicio para gestión de Estudiantes de Vinculación
 * Conecta con el endpoint /api/v1/estudiantes-vinculacion del backend
 */

import apiClient from './apiClient'
import { ENDPOINTS } from '../config/api.config'

const EstudianteVinculacionService = {
  /**
   * Obtener todos los estudiantes de vinculación
   * @param {Object} params - Parámetros de filtro y paginación
   */
  getAll: async (params = {}) => {
    const response = await apiClient.get(ENDPOINTS.ESTUDIANTES_VINCULACION, { params })
    // El backend devuelve { status, message, data }
    return response.data?.data || []
  },

  /**
   * Obtener un estudiante por ID
   * @param {number} id - ID del estudiante
   */
  getById: async (id) => {
    const response = await apiClient.get(`${ENDPOINTS.ESTUDIANTES_VINCULACION}${id}/`)
    return response.data?.data
  },

  /**
   * Crear un nuevo estudiante de vinculación
   * @param {Object} data - Datos del estudiante
   */
  create: async (data) => {
    const response = await apiClient.post(ENDPOINTS.ESTUDIANTES_VINCULACION, data)
    return response.data?.data
  },

  /**
   * Actualizar un estudiante existente
   * @param {number} id - ID del estudiante
   * @param {Object} data - Datos a actualizar
   */
  update: async (id, data) => {
    const response = await apiClient.put(`${ENDPOINTS.ESTUDIANTES_VINCULACION}${id}/`, data)
    return response.data?.data
  },

  /**
   * Eliminar un estudiante
   * @param {number} id - ID del estudiante
   */
  delete: async (id) => {
    const response = await apiClient.delete(`${ENDPOINTS.ESTUDIANTES_VINCULACION}${id}/`)
    return response.data?.data
  },

  /**
   * Buscar estudiantes por carrera
   * @param {string} carrera - Nombre de la carrera
   */
  getByCarrera: async (carrera) => {
    const response = await apiClient.get(ENDPOINTS.ESTUDIANTES_VINCULACION, { params: { carrera } })
    return response.data?.data || []
  },
}

export default EstudianteVinculacionService
