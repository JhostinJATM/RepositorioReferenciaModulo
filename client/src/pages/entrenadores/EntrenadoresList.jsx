import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi'
import { Card, Button, Table, Input } from '../../components/common'
import useEntrenadorStore from '../../stores/entrenadorStore'
import useAuthStore from '../../stores/authStore'

const EntrenadoresList = () => {
  const navigate = useNavigate()
  const { 
    entrenadores, 
    loading, 
    fetchEntrenadores, 
    deleteEntrenador, 
    filtros, 
    setFiltros 
  } = useEntrenadorStore()
  
  const { hasRole } = useAuthStore()
  const canEdit = hasRole(['ADMIN'])

  useEffect(() => {
    fetchEntrenadores()
  }, [fetchEntrenadores, filtros.page, filtros.search])

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este entrenador?')) {
      await deleteEntrenador(id)
    }
  }

  const columns = [
    { key: 'dni', title: 'DNI' },
    { key: 'nombre', title: 'Nombre' },
    { key: 'apellido', title: 'Apellido' },
    { key: 'especialidad', title: 'Especialidad' },
    { key: 'email', title: 'Email' },
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
          <h1 className="text-2xl font-bold text-gray-900">Entrenadores</h1>
          <p className="text-gray-500">Gestión de entrenadores del sistema</p>
        </div>
        {canEdit && (
          <Button onClick={() => navigate('nuevo')}>
            <FiPlus className="w-4 h-4 mr-2" />
            Nuevo Entrenador
          </Button>
        )}
      </div>

      <Card padding={true}>
        <div className="mb-4">
          <div className="max-w-md">
            <Input
              placeholder="Buscar por nombre o DNI..."
              value={filtros.search}
              onChange={(e) => setFiltros({ search: e.target.value, page: 1 })}
              icon={FiSearch}
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={entrenadores}
          loading={loading}
          emptyMessage="No hay entrenadores registrados"
        />
      </Card>
    </div>
  )
}

export default EntrenadoresList
