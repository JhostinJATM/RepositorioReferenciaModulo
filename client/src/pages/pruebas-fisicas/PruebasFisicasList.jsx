import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi'
import { Card, Button, Table, Input } from '../../components/common'
import usePruebaFisicaStore from '../../stores/pruebaFisicaStore'
import useAuthStore from '../../stores/authStore'

const PruebasFisicasList = () => {
  const navigate = useNavigate()
  const { 
    pruebas, 
    loading, 
    fetchPruebas, 
    deletePrueba, 
    filtros, 
    setFiltros 
  } = usePruebaFisicaStore()
  
  const { hasRole } = useAuthStore()
  const canEdit = hasRole(['ADMIN', 'ENTRENADOR', 'ESTUDIANTE_VINCULACION'])

  useEffect(() => {
    fetchPruebas()
  }, [fetchPruebas, filtros.page, filtros.search])

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta prueba?')) {
      await deletePrueba(id)
    }
  }

  const columns = [
    { key: 'atleta_nombre', title: 'Atleta', render: (_, row) => row.atleta_nombre || `ID: ${row.atleta}` },
    { key: 'fecha_prueba', title: 'Fecha' },
    { key: 'tipo_prueba', title: 'Tipo' },
    { key: 'resultado', title: 'Resultado' },
    {
      key: 'actions',
      title: 'Acciones',
      render: (_, row) => (
        <div className="flex space-x-2">
          {canEdit && (
            <>
              <button 
                onClick={() => navigate(`${row.id}/editar`)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                title="Editar"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleDelete(row.id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
                title="Eliminar"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pruebas Físicas</h1>
          <p className="text-gray-500">Gestión de pruebas de rendimiento físico</p>
        </div>
        {canEdit && (
          <Button onClick={() => navigate('nuevo')}>
            <FiPlus className="w-4 h-4 mr-2" />
            Nueva Prueba
          </Button>
        )}
      </div>

      <Card padding={true}>
        <div className="mb-4">
          <div className="max-w-md">
            <Input
              placeholder="Buscar..."
              value={filtros.search}
              onChange={(e) => setFiltros({ search: e.target.value, page: 1 })}
              icon={FiSearch}
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={pruebas}
          loading={loading}
          emptyMessage="No hay pruebas registradas"
        />
      </Card>
    </div>
  )
}

export default PruebasFisicasList
