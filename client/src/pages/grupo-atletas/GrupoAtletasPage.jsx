import { Routes, Route } from 'react-router-dom'
import GrupoAtletasList from './GrupoAtletasList'
import GrupoAtletasAssign from './GrupoAtletasAssign'
import GrupoAtletasDetail from './GrupoAtletasDetail'

const GrupoAtletasPage = () => {
  return (
    <Routes>
      <Route index element={<GrupoAtletasList />} />
      <Route path=":id/asignar" element={<GrupoAtletasAssign />} />
      <Route path=":id/atletas" element={<GrupoAtletasDetail />} />
    </Routes>
  )
}

export default GrupoAtletasPage
