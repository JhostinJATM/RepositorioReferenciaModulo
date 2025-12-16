import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Button, Input, Select } from '../../components/common'
import useAtletaStore from '../../stores/atletaStore'
import { AtletaService } from '../../api'

const AtletaForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { createAtleta, updateAtleta } = useAtletaStore()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre_atleta: '',
    apellido_atleta: '',
    dni: '',
    fecha_nacimiento: '',
    sexo: '',
    categoria: '',
    altura: '',
    peso: '',
    posicion_juego: '',
    equipo_actual: '',
    contacto_emergencia: '',
    telefono_emergencia: '',
    direccion: '',
    email: '',
    telefono: ''
  })

  const isEdit = !!id

  useEffect(() => {
    if (isEdit) {
      loadAtleta()
    }
  }, [id])

  const loadAtleta = async () => {
    try {
      setLoading(true)
      const data = await AtletaService.getById(id)
      setFormData(data)
    } catch (error) {
      console.error('Error cargando atleta:', error)
      navigate('/atletas')
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
      let result
      if (isEdit) {
        result = await updateAtleta(id, formData)
      } else {
        result = await createAtleta(formData)
      }

      if (result.success) {
        navigate('/atletas')
      } else {
        alert('Error al guardar: ' + result.error)
      }
    } catch (error) {
      console.error(error)
      alert('Error inesperado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Editar Atleta' : 'Nuevo Atleta'}
        </h1>
        <p className="text-gray-500">Complete la información del atleta</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Nombre"
              name="nombre_atleta"
              value={formData.nombre_atleta}
              onChange={handleChange}
              required
            />
            <Input
              label="Apellido"
              name="apellido_atleta"
              value={formData.apellido_atleta}
              onChange={handleChange}
              required
            />
            <Input
              label="DNI"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              required
              maxLength={10}
            />
            <Input
              label="Fecha de Nacimiento"
              name="fecha_nacimiento"
              type="date"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              required
            />
            <Select
              label="Sexo"
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
              options={[
                { value: 'M', label: 'Masculino' },
                { value: 'F', label: 'Femenino' }
              ]}
              required
            />
            <Input
              label="Categoría"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              placeholder="Ej: Sub-18"
            />
            <Input
              label="Altura (m)"
              name="altura"
              type="number"
              step="0.01"
              value={formData.altura}
              onChange={handleChange}
            />
            <Input
              label="Peso (kg)"
              name="peso"
              type="number"
              step="0.1"
              value={formData.peso}
              onChange={handleChange}
            />
            <Input
              label="Posición de Juego"
              name="posicion_juego"
              value={formData.posicion_juego}
              onChange={handleChange}
            />
            <Input
              label="Equipo Actual"
              name="equipo_actual"
              value={formData.equipo_actual}
              onChange={handleChange}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contacto de Emergencia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nombre Contacto"
                name="contacto_emergencia"
                value={formData.contacto_emergencia}
                onChange={handleChange}
              />
              <Input
                label="Teléfono Emergencia"
                name="telefono_emergencia"
                value={formData.telefono_emergencia}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/atletas')}
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

export default AtletaForm
