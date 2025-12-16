import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Table, Button } from '../../components/common'
import { GrupoAtletaService } from '../../api'

const GrupoAtletasDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [grupo, setGrupo] = useState(null)
  const [atletas, setAtletas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [grupoResp, atletasResp] = await Promise.all([
        GrupoAtletaService.getById(id),
        GrupoAtletaService.getAtletas(id),
      ])
      setGrupo(grupoResp)
      const list = Array.isArray(atletasResp)
        ? atletasResp.filter(Boolean)
        : Array.isArray(atletasResp?.results)
        ? atletasResp.results.filter(Boolean)
        : []
      setAtletas(list)
    } catch (err) {
      console.error('Error cargando grupo o atletas:', err)
      setError('No se pudieron cargar los datos del grupo')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { key: 'nombre_atleta', title: 'Nombre' },
    { key: 'apellido_atleta', title: 'Apellido' },
    { key: 'dni', title: 'DNI' },
    { key: 'edad', title: 'Edad' },
    { key: 'sexo', title: 'Sexo' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Atletas del Grupo</h1>
          <p className="text-gray-500">
            {grupo ? `${grupo.nombre} (${grupo.categoria})` : 'Cargando grupo...'}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={() => navigate('/grupo-atletas')}>
            Volver
          </Button>
          <Button variant="secondary" onClick={() => navigate(`/grupo-atletas/${id}/asignar`)}>
            Asignar
          </Button>
          <Button variant="secondary" onClick={loadData} disabled={loading}>
            Recargar
          </Button>
        </div>
      </div>

      <Card padding={true}>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <Table
          columns={columns}
          data={atletas}
          loading={loading}
          emptyMessage="Este grupo no tiene atletas asignados"
        />
      </Card>
    </div>
  )
}

export default GrupoAtletasDetail
