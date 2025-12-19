/**
 * Configuración de la API
 * Centraliza las URLs y configuraciones del backend
 * Usa variables de entorno para mayor flexibilidad
 */

// URL base del backend Django (desde variable de entorno)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// URL del módulo de usuarios (Auth)
// Por defecto apunta al servicio de usuarios (Spring) en 8096
export const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL || 'http://localhost:8096'

// Módulo/segmento de la API (el backend usa /api/basketball/)
export const API_MODULE = import.meta.env.VITE_API_MODULE || 'basketball'

// Versión de la API (se mantiene para compatibilidad; no se usa en API_URL)
export const API_VERSION = import.meta.env.VITE_API_VERSION || API_MODULE

// URL completa de la API (incluye el módulo correcto)
export const API_URL = `${API_BASE_URL}/api/${API_MODULE}`

// Endpoints del backend organizados por módulo
// IMPORTANTE: Django requiere trailing slash en las URLs
export const ENDPOINTS = {
  // Atletas
  ATLETAS: '/atletas/',
  
  // Entrenadores
  ENTRENADORES: '/entrenadores/',
  
  // Estudiantes de Vinculación
  ESTUDIANTES_VINCULACION: '/estudiantes-vinculacion/',
  
  // Grupos de Atletas
  GRUPOS_ATLETAS: '/grupos-atletas/',
  
  // Inscripciones
  INSCRIPCIONES: '/inscripciones/',
  
  // Pruebas Antropométricas
  PRUEBAS_ANTROPOMETRICAS: '/pruebas-antropometricas/',
  
  // Pruebas Físicas
  PRUEBAS_FISICAS: '/pruebas-fisicas/',
}

// Configuración de timeout para peticiones (desde variable de entorno)
export const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000

// Headers por defecto
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
}

// Modo debug
export const DEBUG = import.meta.env.VITE_DEBUG === 'true'
