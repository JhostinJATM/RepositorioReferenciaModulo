import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi'
import { Card, Button, Table, Input } from '../../components/common'
import useEstudianteVinculacionStore from '../../stores/estudianteVinculacionStore'
import useAuthStore from '../../stores/authStore'

const EstudiantesVinculacionList = () => {
  const navigate = useNavigate()
  const { 
    estudiantes, 
    loading, 
    fetchEstudiantes, 
    deleteEstudiante, 
    filtros, 
    setFiltros 
  } = useEstudianteVinculacionStore()
  
  const { hasRole } = useAuthStore()
  const canEdit = hasRole(['ADMIN'])

  useEffect(() => {
    fetchEstudiantes()
  }, [fetchEstudiantes, filtros.page, filtros.search])

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este estudiante?')) {
      await deleteEstudiante(id)
    }
  }

  const columns = [
    { key: 'dni', title: 'DNI' },
    { key: 'nombre', title: 'Nombre' },
    { key: 'apellido', title: 'Apellido' },
    { key: 'carrera', title: 'Carrera' },
    { key: 'semestre', title: 'Semestre' },
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
          <h1 className="text-2xl font-bold text-gray-900">Estudiantes de Vinculación</h1>
          <p className="text-gray-500">Gestión de estudiantes en programa de vinculación</p>
        </div>
        {canEdit && (
          <Button onClick={() => navigate('nuevo')}>
            <FiPlus className="w-4 h-4 mr-2" />
            Nuevo Estudiante
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
          data={estudiantes}
          loading={loading}
          emptyMessage="No hay estudiantes registrados"
        />
      </Card>
    </div>
  )
}

export default EstudiantesVinculacionList
