/**
 * Servicio para interactuar con el módulo de usuarios (user_module)
 * Puerto: 8096
 */

import axios from 'axios'

const USER_MODULE_URL = import.meta.env.VITE_USER_MODULE_URL || 'http://localhost:8096'

const userModuleClient = axios.create({
  baseURL: USER_MODULE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Token del módulo de usuarios (separado del token de basketball)
let userModuleToken = null

// Función para hacer login en el módulo de usuarios
const loginToUserModule = async () => {
  try {
    // Credenciales del admin del módulo de usuarios
    const response = await axios.post(`${USER_MODULE_URL}/api/person/login`, {
      email: 'admin@admin.com',
      password: 'admin123'
    })
    
    if (response.data.status === 'success') {
      userModuleToken = response.data.data.token
      console.log('Login exitoso en módulo de usuarios')
      return userModuleToken
    }
  } catch (error) {
    console.error('Error haciendo login en user_module:', error)
    throw new Error('No se pudo autenticar en el módulo de usuarios')
  }
}

// Agregar el token del user_module en cada petición
userModuleClient.interceptors.request.use(
  async (config) => {
    try {
      // Si no tenemos token, hacer login
      if (!userModuleToken) {
        await loginToUserModule()
      }
      
      if (userModuleToken) {
        config.headers.Authorization = userModuleToken
      }
    } catch (error) {
      console.error('Error obteniendo token del user_module:', error)
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Si hay error 401, reintentar con nuevo login
userModuleClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      userModuleToken = null
      await loginToUserModule()
      originalRequest.headers.Authorization = userModuleToken
      return userModuleClient(originalRequest)
    }
    
    return Promise.reject(error)
  }
)

const UserModuleService = {
  /**
   * Crear una nueva persona en el módulo de usuarios
   * @param {Object} personaData - Datos de la persona (nombre, apellido, dni, email, clave, telefono, direccion, rol)
   * @returns {Promise<Object>} - Persona creada con su ID
   */
  crearPersona: async (personaData) => {
    try {
      // Mapear los campos al formato esperado por el backend de Spring Boot
      // Usar save-account que crea la persona CON su cuenta de usuario
      // Campos: first_name, last_name, identification, type_identification, type_stament, direction, phono, email, password
      const mappedData = {
        first_name: personaData.nombre,
        last_name: personaData.apellido,
        identification: personaData.dni,
        type_identification: 'CEDULA', // Por defecto
        type_stament: personaData.rol === 'DOCENTE' ? 'DOCENTES' : 'ESTUDIANTES',
        direction: personaData.direccion || '',
        phono: personaData.telefono || '',
        email: personaData.email,
        password: personaData.clave
      }

      const response = await userModuleClient.post('/api/person/save-account', mappedData)
      
      // La respuesta tiene formato: { data: {}, message: "", status: "success" }
      if (response.data.status === 'success') {
        // El endpoint save-account no devuelve el external_id en la respuesta
        // Necesitamos buscar la persona por su identificación para obtener el external_id
        try {
          const searchResponse = await userModuleClient.get(`/api/person/search_identification/${mappedData.identification}`)
          
          if (searchResponse.data.status === 'success' && searchResponse.data.data) {
            return {
              success: true,
              data: searchResponse.data.data,
              personaId: searchResponse.data.data.external_id || searchResponse.data.data.external || searchResponse.data.data.id
            }
          }
        } catch (searchError) {
          console.error('Error buscando persona creada:', searchError)
        }
        
        // Si no se puede obtener el external_id, devolver error
        return {
          success: false,
          error: 'La persona fue creada pero no se pudo obtener su ID. Contacte al administrador.'
        }
      } else {
        return {
          success: false,
          error: response.data.message || 'Error al crear persona'
        }
      }
    } catch (error) {
      console.error('Error creando persona en user_module:', error)
      console.error('Detalles del error:', error.response?.data)
      
      // Extraer mensaje de error más detallado
      let errorMessage = 'Error al crear persona'
      if (error.response?.data) {
        const errorData = error.response.data
        if (errorData.message) {
          errorMessage = errorData.message
        }
        // Si hay errores de validación específicos
        if (errorData.errors && typeof errorData.errors === 'object') {
          const errorDetails = Object.entries(errorData.errors)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join(', ')
          errorMessage += ` - ${errorDetails}`
        }
      }
      
      return {
        success: false,
        error: errorMessage
      }
    }
  },

  /**
   * Obtener una persona por external ID
   * @param {string} external - External ID de la persona
   */
  obtenerPersona: async (external) => {
    try {
      const response = await userModuleClient.get(`/api/person/search/${external}`)
      return {
        success: true,
        data: response.data.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener persona'
      }
    }
  },

  /**
   * Actualizar una persona existente
   * @param {Object} personaData - Datos actualizados (debe incluir external)
   */
  actualizarPersona: async (personaData) => {
    try {
      const mappedData = {
        external: personaData.external,
        first_name: personaData.nombre,
        last_name: personaData.apellido,
        identification: personaData.dni,
        type_identification: 'CEDULA',
        type_stament: personaData.rol === 'DOCENTE' ? 'DOCENTES' : 'ESTUDIANTES',
        direction: personaData.direccion || '',
        phono: personaData.telefono || ''
      }
      
      const response = await userModuleClient.put('/api/person/update', mappedData)
      return {
        success: response.data.status === 'success',
        data: response.data.data,
        error: response.data.message
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al actualizar persona'
      }
    }
  },

  /**
   * Verificar si un DNI ya existe
   * @param {string} identification - DNI a verificar
   */
  verificarDniExistente: async (identification) => {
    try {
      const response = await userModuleClient.get(`/api/person/search_identification/${identification}`)
      return {
        existe: response.data.status === 'success',
        persona: response.data.data
      }
    } catch (error) {
      if (error.response?.status === 404) {
        return { existe: false }
      }
      return { existe: false }
    }
  },

  /**
   * Obtener todas las personas
   */
  obtenerTodasPersonas: async () => {
    try {
      const response = await userModuleClient.get('/api/person/all')
      return {
        success: true,
        data: response.data.data
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Error al obtener personas'
      }
    }
  },

  /**
   * Buscar persona por external_id
   * @param {string} externalId - External ID de la persona
   */
  buscarPorExternalId: async (externalId) => {
    try {
      // Intentar con search (endpoint principal)
      const response = await userModuleClient.get(`/api/person/search/${externalId}`)
      if (response.data.status === 'success') {
        const data = response.data.data
        // Normalizar campos (el backend tiene typo: firts_name en lugar de first_name)
        return {
          external_id: data.external,
          external: data.external,
          identification: data.identification,
          first_name: data.first_name || data.firts_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phono: data.phono || '',
          direction: data.direction || '',
          photo: data.photo || '',
          type_stament: data.type_stament || '',
          type_identification: data.type_identification || ''
        }
      }
      
      return null
    } catch (error) {
      console.error(`Error buscando persona ${externalId}:`, error)
      return null
    }
  }
}

export default UserModuleService
