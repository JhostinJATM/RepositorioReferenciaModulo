import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Button, Input } from '../../components/common'
import useGrupoStore from '../../stores/grupoStore'
import { GrupoAtletaService } from '../../api'

const GrupoForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { createGrupo, updateGrupo } = useGrupoStore()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre_grupo: '',
    categoria: '',
    descripcion: '',
    rango_edad_minima: 0,
    rango_edad_maxima: 99,
    entrenador: 13, // id de entrenador demo creado en backend
  })

  const isEdit = !!id

  useEffect(() => {
    if (isEdit) {
      loadGrupo()
    }
  }, [id])

  const loadGrupo = async () => {
    try {
      setLoading(true)
      const data = await GrupoAtletaService.getById(id)
      setFormData({
        nombre_grupo: data.nombre || '',
        categoria: data.categoria || '',
        descripcion: data.descripcion || '',
        rango_edad_minima: data.rango_edad_minima ?? 0,
        rango_edad_maxima: data.rango_edad_maxima ?? 99,
        entrenador: data.entrenador || 13,
      })
    } catch (error) {
      console.error('Error cargando grupo:', error)
      navigate('/grupos')
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
        result = await updateGrupo(id, formData)
      } else {
        result = await createGrupo(formData)
      }

      if (result.success) {
        navigate('/grupos')
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
          {isEdit ? 'Editar Grupo' : 'Nuevo Grupo'}
        </h1>
        <p className="text-gray-500">Complete la información del grupo</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Input
              label="Nombre del Grupo"
              name="nombre_grupo"
              value={formData.nombre_grupo}
              onChange={handleChange}
              required
            />
            <Input
              label="Categoría"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              required
            />
            <div className="flex flex-col space-y-1">
              <label className="text-sm font-medium text-gray-700">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/grupos')}
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

export default GrupoForm
