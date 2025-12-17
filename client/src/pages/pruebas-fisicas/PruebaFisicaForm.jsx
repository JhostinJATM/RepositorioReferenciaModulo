import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Button, Input, Select } from '../../components/common'
import usePruebaFisicaStore from '../../stores/pruebaFisicaStore'
import useAtletaStore from '../../stores/atletaStore'
import { PruebaFisicaService } from '../../api'

const PruebaFisicaForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { createPrueba, updatePrueba } = usePruebaFisicaStore()
  const { atletas, fetchAtletas } = useAtletaStore()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    atleta: '',
    fecha_prueba: new Date().toISOString().split('T')[0],
    tipo_prueba: '',
    nombre_prueba: '',
    unidad_medida: '',
    resultado: '',
    valoracion: '',
    observaciones: ''
  })

  const isEdit = !!id

  useEffect(() => {
    fetchAtletas()
    if (isEdit) {
      loadPrueba()
    }
  }, [id])

  const loadPrueba = async () => {
    try {
      setLoading(true)
      const data = await PruebaFisicaService.getById(id)
      setFormData({
        atleta: data.atleta?.id || data.atleta || '',
        fecha_prueba: data.fecha_prueba || data.fecha_registro || '',
        tipo_prueba: data.tipo_prueba || '',
        nombre_prueba: data.nombre_prueba || data.tipo_prueba || '',
        unidad_medida: data.unidad_medida || '',
        resultado: data.resultado ?? '',
        valoracion: data.valoracion || '',
        observaciones: data.observaciones || ''
      })
    } catch (error) {
      console.error('Error cargando prueba:', error)
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
      let result
      if (isEdit) {
        result = await updatePrueba(id, formData)
      } else {
        result = await createPrueba(formData)
      }

      if (result.success) {
        navigate('..')
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
          {isEdit ? 'Editar Prueba Física' : 'Nueva Prueba Física'}
        </h1>
        <p className="text-gray-500">Complete la información de la prueba</p>
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
              label="Fecha de Prueba"
              name="fecha_prueba"
              type="date"
              value={formData.fecha_prueba}
              onChange={handleChange}
              required
            />
            <Select
              label="Tipo de Prueba"
              name="tipo_prueba"
              value={formData.tipo_prueba}
              onChange={handleChange}
              options={[
                { value: 'VELOCIDAD', label: 'Velocidad' },
                { value: 'RESISTENCIA', label: 'Resistencia' },
                { value: 'FUERZA', label: 'Fuerza' },
                { value: 'FLEXIBILIDAD', label: 'Flexibilidad' },
                { value: 'COORDINACION', label: 'Coordinación' },
                { value: 'AGILIDAD', label: 'Agilidad' },
              ]}
              required
            />
            <Input
              label="Nombre de la Prueba"
              name="nombre_prueba"
              value={formData.nombre_prueba}
              onChange={handleChange}
              placeholder="Ej: Salto vertical 40cm"
              required
            />
            <Input
              label="Unidad de Medida"
              name="unidad_medida"
              value={formData.unidad_medida}
              onChange={handleChange}
              placeholder="Ej: cm, s, repeticiones"
              required
            />
            <Input
              label="Resultado (solo número)"
              name="resultado"
              type="number"
              step="0.01"
              value={formData.resultado}
              onChange={handleChange}
              placeholder="Ej: 45"
              required
            />
            <Input
              label="Valoración"
              name="valoracion"
              value={formData.valoracion}
              onChange={handleChange}
              placeholder="Ej: Excelente, Bueno"
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

export default PruebaFisicaForm
