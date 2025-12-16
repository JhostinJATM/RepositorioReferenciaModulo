/**
 * Página principal de Inscripciones
 * TODO: Implementar por el integrante del equipo asignado
 */

import { Routes, Route } from 'react-router-dom'
import InscripcionesList from './InscripcionesList'
import InscripcionForm from './InscripcionForm'

const InscripcionesPage = () => {
  return (
    <Routes>
      <Route index element={<InscripcionesList />} />
      <Route path="nuevo" element={<InscripcionForm />} />
      <Route path=":id/editar" element={<InscripcionForm />} />
    </Routes>
  )
}

export default InscripcionesPage
