import { Routes, Route } from 'react-router-dom'
import GrupoAtletasList from './GrupoAtletasList'
import GrupoAtletasAssign from './GrupoAtletasAssign'

const GrupoAtletasPage = () => {
  return (
    <Routes>
      <Route index element={<GrupoAtletasList />} />
      <Route path=":id/asignar" element={<GrupoAtletasAssign />} />
    </Routes>
  )
}

export default GrupoAtletasPage
