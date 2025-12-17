import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Card, Button, Input } from '../../components/common'
import useEstudianteVinculacionStore from '../../stores/estudianteVinculacionStore'
import { EstudianteVinculacionService } from '../../api'
import UserModuleService from '../../api/userModuleService'

const EstudianteVinculacionForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { createEstudiante, updateEstudiante } = useEstudianteVinculacionStore()
  
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
    // Datos específicos de Pasante (del módulo basketball)
    carrera: '',
    semestre: '',
    universidad: '',
    fecha_inicio: '',
    fecha_fin: ''
  })

  const isEdit = !!id

  useEffect(() => {
    if (isEdit) {
      loadEstudiante()
    }
  }, [id])

  const loadEstudiante = async () => {
    try {
      setLoading(true)
      const data = await EstudianteVinculacionService.getById(id)
      setFormData(data)
    } catch (error) {
      console.error('Error cargando estudiante:', error)
      toast.error('Error al cargar el estudiante')
      navigate('/estudiantes-vinculacion')
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
        // Modo edición: solo actualizar datos de pasante
        const pasanteData = {
          carrera: formData.carrera,
          semestre: formData.semestre,
          universidad: formData.universidad,
          fecha_inicio: formData.fecha_inicio,
          fecha_fin: formData.fecha_fin
        }
        const result = await updateEstudiante(id, pasanteData)
        
        if (result.success) {
          toast.success('Estudiante actualizado correctamente')
          navigate('/estudiantes-vinculacion')
        } else {
          toast.error('Error al actualizar: ' + result.error)
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
          rol: 'ESTUDIANTE', // Rol para pasantes/estudiantes
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
          
          toast.error(errorMsg)
          return
        }

        if (!personaResult.personaId) {
          toast.error('Error: No se recibió el ID de la persona creada')
          return
        }

        // Ahora crear el pasante en basketball module con el personaId
        const pasanteData = {
          persona_external: personaResult.personaId,
          carrera: formData.carrera,
          semestre: formData.semestre,
          universidad: formData.universidad,
          fecha_inicio: formData.fecha_inicio,
          fecha_fin: formData.fecha_fin
        }
        
        const result = await createEstudiante(pasanteData)
        
        if (result.success) {
          toast.success('Estudiante creado exitosamente')
          navigate('/estudiantes-vinculacion')
        } else {
          toast.error('Error al crear estudiante: ' + result.error)
        }
      }
    } catch (error) {
      console.error('Error en formulario:', error)
      toast.error('Error: ' + (error.message || 'Error desconocido'))
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEdit) return <div>Cargando...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        {isEdit ? 'Editar' : 'Nuevo'} Estudiante de Vinculación
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
                    placeholder="Ej: María"
                    required
                  />

                  <Input
                    label="Apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    placeholder="Ej: González"
                    required
                  />

                  <Input
                    label="DNI / Cédula"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    placeholder="Ej: 0987654321"
                    required
                    maxLength={13}
                  />

                  <Input
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ej: maria.gonzalez@email.com"
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
                  placeholder="Ej: Calle Secundaria 456"
                />

                <hr className="my-6" />

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-green-800">
                    <strong>Datos de Estudiante:</strong> Información específica del estudiante de vinculación.
                  </p>
                </div>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Carrera"
                name="carrera"
                value={formData.carrera}
                onChange={handleChange}
                placeholder="Ej: Educación Física"
                required
              />

              <Input
                label="Semestre"
                name="semestre"
                value={formData.semestre}
                onChange={handleChange}
                placeholder="Ej: 5"
                required
              />

              <Input
                label="Universidad"
                name="universidad"
                value={formData.universidad}
                onChange={handleChange}
                placeholder="Ej: Universidad Central"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Fecha Inicio"
                name="fecha_inicio"
                type="date"
                value={formData.fecha_inicio}
                onChange={handleChange}
                required
              />

              <Input
                label="Fecha Fin"
                name="fecha_fin"
                type="date"
                value={formData.fecha_fin}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/estudiantes-vinculacion')}
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

export default EstudianteVinculacionForm
