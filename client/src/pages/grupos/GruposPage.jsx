/**
 * Página principal de Grupos de Atletas
 * TODO: Implementar por el integrante del equipo asignado
 */

import { Routes, Route } from 'react-router-dom'
import GruposList from './GruposList'
import GrupoForm from './GrupoForm'

const GruposPage = () => {
  return (
    <Routes>
      <Route index element={<GruposList />} />
      <Route path="nuevo" element={<GrupoForm />} />
      <Route path=":id/editar" element={<GrupoForm />} />
    </Routes>
  )
}

export default GruposPage
