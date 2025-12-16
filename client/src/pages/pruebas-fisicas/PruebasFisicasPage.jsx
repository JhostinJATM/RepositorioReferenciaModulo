/**
 * Página principal de Pruebas Físicas
 * TODO: Implementar por el integrante del equipo asignado
 */

import { Routes, Route } from 'react-router-dom'
import PruebasFisicasList from './PruebasFisicasList'
import PruebaFisicaForm from './PruebaFisicaForm'

const PruebasFisicasPage = () => {
  return (
    <Routes>
      <Route index element={<PruebasFisicasList />} />
      <Route path="nuevo" element={<PruebaFisicaForm />} />
      <Route path=":id/editar" element={<PruebaFisicaForm />} />
    </Routes>
  )
}

export default PruebasFisicasPage
