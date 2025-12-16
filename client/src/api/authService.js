import axios from 'axios'
import { AUTH_API_URL } from '../config/api.config'

const authApi = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const login = async (credentials) => {
  // El módulo de usuarios expone /api/person/login y espera email/password
  const payload = {
    email: credentials.username,
    password: credentials.password,
  }

  const response = await authApi.post('/api/person/login', payload)

  // Respuesta esperada: { status: 'success', data: { token, ... }, message }
  const data = response.data?.data || {}
  const token = data.token || response.data?.token

  return { token, user: data, raw: response.data }
}

export default authApi
