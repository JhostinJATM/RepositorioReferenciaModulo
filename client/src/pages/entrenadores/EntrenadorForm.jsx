import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Button, Input } from '../../components/common'
import useEntrenadorStore from '../../stores/entrenadorStore'
import { EntrenadorService } from '../../api'
import UserModuleService from '../../api/userModuleService'

const EntrenadorForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { createEntrenador, updateEntrenador } = useEntrenadorStore()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Datos de Persona (del módulo de usuarios)
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    clave: '',
    telefono: '',
    direccion: '',
    // Datos específicos de Entrenador (del módulo basketball)
    especialidad: '',
    club_asignado: ''
  })

  const isEdit = !!id

  useEffect(() => {
    if (isEdit) {
      loadEntrenador()
    }
  }, [id])

  const loadEntrenador = async () => {
    try {
      setLoading(true)
      const data = await EntrenadorService.getById(id)
      setFormData(data)
    } catch (error) {
      console.error('Error cargando entrenador:', error)
      navigate('..')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (isEdit) {
        // Modo edición: solo actualizar datos de entrenador
        const entrenadorData = {
          especialidad: formData.especialidad,
          club_asignado: formData.club_asignado
        }
        const result = await updateEntrenador(id, entrenadorData)
        
        if (result.success) {
          navigate('..')
        } else {
          alert('Error al actualizar: ' + result.error)
        }
      } else {
        // Modo creación: Primero crear la persona en user_module
        const personaData = {
          nombre: formData.nombre,
          apellido: formData.apellido,
          dni: formData.dni,
          email: formData.email,
          clave: formData.clave,
          telefono: formData.telefono || '',
          direccion: formData.direccion || '',
          rol: 'DOCENTE', // Rol para entrenadores
          estado: true
        }
        
        const personaResult = await UserModuleService.crearPersona(personaData)
        
        if (!personaResult.success) {
          // Mostrar mensaje de error específico
          let errorMsg = personaResult.error || 'Error al crear la persona en el módulo de usuarios'
          
          // Si el error es por email duplicado, dar más contexto
          if (errorMsg.includes('correo') || errorMsg.includes('email') || errorMsg.includes('registrada')) {
            errorMsg = `El email "${formData.email}" ya está registrado en el sistema. Por favor usa otro email.`
          } else if (errorMsg.includes('identificacion') || errorMsg.includes('DNI') || errorMsg.includes('cedula')) {
            errorMsg = `El DNI/Cédula "${formData.dni}" ya está registrado en el sistema.`
          }
          
          alert(errorMsg)
          return
        }

        if (!personaResult.personaId) {
          alert('Error: No se recibió el ID de la persona creada')
          return
        }

        // Ahora crear el entrenador en basketball module con el personaId
        const entrenadorData = {
          persona_external: personaResult.personaId,
          especialidad: formData.especialidad,
          club_asignado: formData.club_asignado
        }
        
        const result = await createEntrenador(entrenadorData)
        
        if (result.success) {
          alert('Entrenador creado exitosamente')
          navigate('..')
        } else {
          alert('Error al crear entrenador: ' + result.error)
        }
      }
    } catch (error) {
      console.error('Error en formulario:', error)
      alert('Error: ' + (error.message || 'Error desconocido'))
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEdit) return <div>Cargando...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        {isEdit ? 'Editar' : 'Nuevo'} Entrenador
      </h1>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {!isEdit && (
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Datos de Persona:</strong> Esta información se guardará primero en el módulo de usuarios.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Ej: Juan"
                    required
                  />

                  <Input
                    label="Apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    placeholder="Ej: Pérez"
                    required
                  />

                  <Input
                    label="DNI / Cédula"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    placeholder="Ej: 1234567890"
                    required
                    maxLength={13}
                  />

                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ej: juan.perez@email.com"
                    required
                  />

                  <Input
                    label="Contraseña"
                    name="clave"
                    type="password"
                    value={formData.clave}
                    onChange={handleChange}
                    placeholder="Contraseña para acceso al sistema"
                    required
                    minLength={6}
                  />

                  <Input
                    label="Teléfono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    placeholder="Ej: 0999999999"
                  />
                </div>

                <Input
                  label="Dirección"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Ej: Av. Principal 123"
                />

                <hr className="my-6" />

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-green-800">
                    <strong>Datos de Entrenador:</strong> Información específica del rol de entrenador.
                  </p>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Especialidad"
                name="especialidad"
                value={formData.especialidad}
                onChange={handleChange}
                placeholder="Ej: Entrenamiento Físico, Técnica"
                required
              />

              <Input
                label="Club Asignado"
                name="club_asignado"
                value={formData.club_asignado}
                onChange={handleChange}
                placeholder="Ej: Club Deportivo Municipal"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('..')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default EntrenadorForm
