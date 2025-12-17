import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import MainLayout from './layouts/MainLayout'
import LoginPage from './pages/LoginPage'
import LandingPage from './pages/LandingPage'
import ProtectedRoute from './components/common/ProtectedRoute'
import HomePage from './pages/HomePage'
import AtletasPage from './pages/atletas/AtletasPage'
import EntrenadoresPage from './pages/entrenadores/EntrenadoresPage'
import GruposPage from './pages/grupos/GruposPage'
import GrupoAtletasPage from './pages/grupo-atletas/GrupoAtletasPage'
import InscripcionesPage from './pages/inscripciones/InscripcionesPage'
import PruebasAntropometricasPage from './pages/pruebas-antropometricas/PruebasAntropometricasPage'
import PruebasFisicasPage from './pages/pruebas-fisicas/PruebasFisicasPage'
import EstudiantesVinculacionPage from './pages/estudiantes-vinculacion/EstudiantesVinculacionPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="home" element={<HomePage />} />
            <Route element={<ProtectedRoute allowedRoles={["ADMIN", "ENTRENADOR", "ESTUDIANTE_VINCULACION"]} />}>
              <Route path="atletas/*" element={<AtletasPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="entrenadores/*" element={<EntrenadoresPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["ADMIN", "ENTRENADOR"]} />}>
              <Route path="grupos/*" element={<GruposPage />} />
              <Route path="grupo-atletas/*" element={<GrupoAtletasPage />} />
              <Route path="inscripciones/*" element={<InscripcionesPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["ADMIN", "ENTRENADOR", "ESTUDIANTE_VINCULACION"]} />}>
              <Route path="pruebas-antropometricas/*" element={<PruebasAntropometricasPage />} />
              <Route path="pruebas-fisicas/*" element={<PruebasFisicasPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="estudiantes-vinculacion/*" element={<EstudiantesVinculacionPage />} />
            </Route>
          </Route>
          {/* Catch all for protected routes or general 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
