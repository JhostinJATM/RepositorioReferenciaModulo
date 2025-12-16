import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiLink, FiUsers } from 'react-icons/fi'
import { Card, Table, Button } from '../../components/common'
import useGrupoStore from '../../stores/grupoStore'
import useAuthStore from '../../stores/authStore'

const GrupoAtletasList = () => {
  const navigate = useNavigate()
  const { grupos, loading, fetchGrupos, filtros, setFiltros } = useGrupoStore()
  const { hasRole } = useAuthStore()
  const canEdit = hasRole(['ADMIN', 'ENTRENADOR'])

  useEffect(() => {
    fetchGrupos()
  }, [fetchGrupos, filtros.page, filtros.search])

  const columns = [
    { key: 'nombre', title: 'Nombre' },
    { key: 'categoria', title: 'Categoría' },
    { key: 'rango_edad_minima', title: 'Edad Min' },
    { key: 'rango_edad_maxima', title: 'Edad Max' },
    { key: 'descripcion', title: 'Descripción' },
    {
      key: 'actions',
      title: 'Acciones',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/grupo-atletas/${row.id}/atletas`)}
            className="p-1 text-gray-700 hover:bg-gray-100 rounded"
            title="Ver atletas"
          >
            <FiUsers className="w-4 h-4" />
          </button>
          {canEdit && (
            <button
              onClick={() => navigate(`/grupo-atletas/${row.id}/asignar`)}
              className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"
              title="Asignar atletas"
            >
              <FiLink className="w-4 h-4" />
            </button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grupos</h1>
          <p className="text-gray-500">Selecciona un grupo y asigna atletas</p>
        </div>
        <Button variant="secondary" onClick={() => fetchGrupos()} disabled={loading}>
          Recargar
        </Button>
      </div>

      <Card padding={true}>
        <Table
          columns={columns}
          data={grupos}
          loading={loading}
          emptyMessage="No hay grupos registrados"
        />
      </Card>
    </div>
  )
}

export default GrupoAtletasList
