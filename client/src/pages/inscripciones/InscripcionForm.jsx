import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Button, Input, Select } from '../../components/common'
import useInscripcionStore from '../../stores/inscripcionStore'
import useAtletaStore from '../../stores/atletaStore'
import { InscripcionService } from '../../api'

const InscripcionForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { createInscripcion, updateInscripcion } = useInscripcionStore()
  const { atletas, fetchAtletas } = useAtletaStore()

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    atleta: '',
    fecha_inscripcion: new Date().toISOString().split('T')[0],
    tipo_inscripcion: 'FEDERADO',
    observaciones: '',
    habilitada: true,
  })

  const isEdit = !!id

  useEffect(() => {
    fetchAtletas()
    if (isEdit) {
      loadInscripcion()
    }
  }, [id])

  const loadInscripcion = async () => {
    try {
      setLoading(true)
      const data = await InscripcionService.getById(id)
      setFormData({
        atleta: data.atleta?.id || data.atleta || '',
        fecha_inscripcion: data.fecha_inscripcion || '',
        tipo_inscripcion: data.tipo_inscripcion || 'FEDERADO',
        observaciones: data.observaciones || '',
        habilitada: data.habilitada ?? true,
      })
    } catch (error) {
      console.error('Error cargando inscripción:', error)
      navigate('/inscripciones')
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
        result = await updateInscripcion(id, formData)
      } else {
        result = await createInscripcion(formData)
      }

      if (result.success) {
        navigate('/inscripciones')
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
          {isEdit ? 'Editar Inscripción' : 'Nueva Inscripción'}
        </h1>
        <p className="text-gray-500">Complete la información de la inscripción</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Atleta"
              name="atleta"
              value={formData.atleta}
              onChange={handleChange}
              options={atletas.map(a => ({ value: a.id, label: `${a.nombre_atleta} ${a.apellido_atleta} - ${a.dni}` }))}
              required
            />
            <Input
              label="Fecha de Inscripción"
              name="fecha_inscripcion"
              type="date"
              value={formData.fecha_inscripcion}
              onChange={handleChange}
              required
            />
            <Select
              label="Tipo de Inscripción"
              name="tipo_inscripcion"
              value={formData.tipo_inscripcion}
              onChange={handleChange}
              options={[
                { value: 'FEDERADO', label: 'Federado' },
                { value: 'NO_FEDERADO', label: 'No Federado' },
                { value: 'INVITADO', label: 'Invitado' },
              ]}
              required
            />
            <Select
              label="Habilitada"
              name="habilitada"
              value={formData.habilitada ? 'true' : 'false'}
              onChange={(e) => setFormData(prev => ({ ...prev, habilitada: e.target.value === 'true' }))}
              options={[
                { value: 'true', label: 'Sí' },
                { value: 'false', label: 'No' },
              ]}
              required
            />
          </div>

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">Observaciones</label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/inscripciones')}
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

export default InscripcionForm
