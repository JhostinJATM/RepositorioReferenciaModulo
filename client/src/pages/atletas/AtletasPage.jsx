/**
 * Página principal de Atletas
 */

import { Routes, Route } from 'react-router-dom'
import AtletasList from './AtletasList'
import AtletaForm from './AtletaForm'

const AtletasPage = () => {
  return (
    <Routes>
      <Route index element={<AtletasList />} />
      <Route path="nuevo" element={<AtletaForm />} />
      <Route path=":id/editar" element={<AtletaForm />} />
    </Routes>
  )
}

export default AtletasPage
