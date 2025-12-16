import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Button, Input, Select } from '../../components/common'
import usePruebaAntropometricaStore from '../../stores/pruebaAntropometricaStore'
import useAtletaStore from '../../stores/atletaStore'
import { PruebaAntropometricaService } from '../../api'

const PruebaAntropometricaForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { createPrueba, updatePrueba } = usePruebaAntropometricaStore()
  const { atletas, fetchAtletas } = useAtletaStore()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    atleta: '',
    fecha_prueba: new Date().toISOString().split('T')[0],
    peso: '',
    altura: '',
    envergadura: '',
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
      const data = await PruebaAntropometricaService.getById(id)
      setFormData({
        atleta: data.atleta?.id || data.atleta || '',
        fecha_prueba: data.fecha_prueba || data.fecha_registro || '',
        peso: data.peso ?? '',
        altura: data.altura ?? data.estatura ?? '',
        envergadura: data.envergadura ?? '',
        observaciones: data.observaciones || ''
      })
    } catch (error) {
      console.error('Error cargando prueba:', error)
      navigate('/pruebas-antropometricas')
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
        navigate('/pruebas-antropometricas')
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
          {isEdit ? 'Editar Prueba Antropométrica' : 'Nueva Prueba Antropométrica'}
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
            <Input
              label="Peso (kg)"
              name="peso"
              type="number"
              step="0.1"
              value={formData.peso}
              onChange={handleChange}
              required
            />
            <Input
              label="Altura/Estatura (cm)"
              name="altura"
              type="number"
              step="0.1"
              value={formData.altura}
              onChange={handleChange}
              required
            />
            <Input
              label="Envergadura (cm)"
              name="envergadura"
              type="number"
              step="0.1"
              value={formData.envergadura}
              onChange={handleChange}
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
              onClick={() => navigate('/pruebas-antropometricas')}
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

export default PruebaAntropometricaForm
