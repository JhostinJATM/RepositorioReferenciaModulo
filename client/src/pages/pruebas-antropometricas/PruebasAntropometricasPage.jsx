/**
 * Página principal de Pruebas Antropométricas
 * TODO: Implementar por el integrante del equipo asignado
 */

import { Routes, Route } from 'react-router-dom'
import PruebasAntropometricasList from './PruebasAntropometricasList'
import PruebaAntropometricaForm from './PruebaAntropometricaForm'

const PruebasAntropometricasPage = () => {
  return (
    <Routes>
      <Route index element={<PruebasAntropometricasList />} />
      <Route path="nuevo" element={<PruebaAntropometricaForm />} />
      <Route path=":id/editar" element={<PruebaAntropometricaForm />} />
    </Routes>
  )
}

export default PruebasAntropometricasPage
