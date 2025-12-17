import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button } from '../../components/common'
import { GrupoAtletaService, AtletaService } from '../../api'

const GrupoAtletasAssign = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [grupos, setGrupos] = useState([])
  const [atletas, setAtletas] = useState([])
  const [selectedGroupId, setSelectedGroupId] = useState(null)
  const [selectedAtletas, setSelectedAtletas] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [gruposResp, atletasResp] = await Promise.all([
        GrupoAtletaService.getAll({ pageSize: 200 }),
        AtletaService.getAll({ pageSize: 200 }),
      ])

      const gruposData = normalizeList(gruposResp)
      const atletasData = normalizeList(atletasResp)

      setGrupos(gruposData)
      setAtletas(atletasData)

      const targetId = id ? Number(id) : gruposData[0]?.id
      if (targetId) {
        await loadAtletasGrupo(targetId, gruposData)
      }
    } catch (err) {
      console.error('Error cargando datos:', err)
      setError('No se pudieron cargar los datos de grupos/atletas')
    } finally {
      setLoading(false)
    }
  }

  const loadAtletasGrupo = async (grupoId) => {
    if (!grupoId) return
    setLoading(true)
    setError('')
    try {
      const data = await GrupoAtletaService.getAtletas(grupoId)
      const atletasAsignados = normalizeList(data).map((a) => a.id)
      setSelectedGroupId(grupoId)
      setSelectedAtletas(atletasAsignados)
    } catch (err) {
      console.error('Error cargando atletas del grupo:', err)
      setError('No se pudieron cargar los atletas del grupo')
      setSelectedAtletas([])
    } finally {
      setLoading(false)
    }
  }

  const handleGroupChange = async (e) => {
    const grupoId = Number(e.target.value)
    await loadAtletasGrupo(grupoId)
  }

  const handleAtletasChange = (e) => {
    const options = Array.from(e.target.selectedOptions).map((o) => Number(o.value))
    setSelectedAtletas(options)
  }

  const handleSave = async () => {
    if (!selectedGroupId) return
    setSaving(true)
    setError('')
    try {
      await GrupoAtletaService.asignarAtletas(selectedGroupId, selectedAtletas)
    } catch (err) {
      console.error('Error asignando atletas:', err)
      setError('No se pudo guardar la asignación')
    } finally {
      setSaving(false)
    }
  }

  const selectedGroup = grupos.find((g) => g.id === selectedGroupId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asignar Atletas a Grupos</h1>
          <p className="text-gray-500">Gestiona las asignaciones sin modificar los datos del grupo</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => navigate('..')}>
            Volver
          </Button>
          <Button variant="secondary" onClick={loadData} disabled={loading}>
            Recargar
          </Button>
        </div>
      </div>

      <Card padding={true}>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <label className="text-sm font-medium text-gray-700 block mb-2">Grupo</label>
            <select
              value={selectedGroupId || ''}
              onChange={handleGroupChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2"
              disabled={loading || !grupos.length}
            >
              {!grupos.length && <option value="">No hay grupos disponibles</option>}
              {grupos.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nombre} ({g.categoria})
                </option>
              ))}
            </select>

            {selectedGroup && (
              <div className="mt-4 text-sm text-gray-600 space-y-1">
                <p><span className="font-semibold">Edad:</span> {selectedGroup.rango_edad_minima} - {selectedGroup.rango_edad_maxima}</p>
                <p><span className="font-semibold">Descripción:</span> {selectedGroup.descripcion || 'Sin descripción'}</p>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-700 block mb-2">Atletas asignados</label>
            <select
              multiple
              value={selectedAtletas}
              onChange={handleAtletasChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2 h-72"
              disabled={loading || !atletas.length}
            >
              {atletas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre_atleta} {a.apellido_atleta} - {a.dni}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-2">Usa Ctrl/Cmd + clic para seleccionar múltiples atletas.</p>

            <div className="flex justify-end mt-4 space-x-3">
              <Button variant="primary" onClick={handleSave} disabled={saving || loading || !selectedGroupId}>
                {saving ? 'Guardando...' : 'Guardar asignación'}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function normalizeList(data) {
  if (!data) return []
  if (Array.isArray(data)) return data.filter(Boolean)
  if (Array.isArray(data.results)) return data.results.filter(Boolean)
  if (data.results && Array.isArray(data.results)) return data.results.filter(Boolean)
  return []
}

export default GrupoAtletasAssign
