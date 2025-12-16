import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi'
import { Card, Button, Table, Input } from '../../components/common'
import useInscripcionStore from '../../stores/inscripcionStore'
import useAuthStore from '../../stores/authStore'

const InscripcionesList = () => {
  const navigate = useNavigate()
  const { 
    inscripciones, 
    loading, 
    fetchInscripciones, 
    deleteInscripcion, 
    filtros, 
    setFiltros 
  } = useInscripcionStore()
  
  const { hasRole } = useAuthStore()
  const canEdit = hasRole(['ADMIN', 'DOCENTE'])

  useEffect(() => {
    fetchInscripciones()
  }, [fetchInscripciones, filtros.page, filtros.search])

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta inscripción?')) {
      await deleteInscripcion(id)
    }
  }

  const columns = [
    { key: 'atleta_nombre', title: 'Atleta', render: (_, row) => row.atleta_nombre || `ID: ${row.atleta}` },
    { key: 'grupo_nombre', title: 'Grupo', render: (_, row) => row.grupo_nombre || `ID: ${row.grupo}` },
    { key: 'fecha_inscripcion', title: 'Fecha' },
    { key: 'estado', title: 'Estado' },
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
          <h1 className="text-2xl font-bold text-gray-900">Inscripciones</h1>
          <p className="text-gray-500">Gestión de inscripciones de atletas</p>
        </div>
        {canEdit && (
          <Button onClick={() => navigate('nuevo')}>
            <FiPlus className="w-4 h-4 mr-2" />
            Nueva Inscripción
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
          data={inscripciones}
          loading={loading}
          emptyMessage="No hay inscripciones registradas"
        />
      </Card>
    </div>
  )
}

export default InscripcionesList
