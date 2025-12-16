import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../stores/authStore'
import { login } from '../api/authService'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

const LoginPage = () => {
  const navigate = useNavigate()
  const setToken = useAuthStore((state) => state.setToken)
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Llamada al servicio de autenticación
      const response = await login(formData)
      
      // Asumiendo que la respuesta trae el token en 'token' o 'accessToken'
      const token = response.token || response.accessToken
      
      if (token) {
        setToken(token, response.user)
        navigate('/')
      } else {
        setError('No se recibió un token válido')
      }
    } catch (err) {
      console.error(err)
      setError('Credenciales inválidas o error en el servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Iniciar Sesión</h2>
          <p className="mt-2 text-gray-600">Sistema de Gestión de Baloncesto</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded text-sm text-center">
              {error}
            </div>
          )}

          <Input
            label="Usuario / Correo"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Ingrese su usuario"
          />

          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Ingrese su contraseña"
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
