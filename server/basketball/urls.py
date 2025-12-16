from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .controllers.entrenador_controller import EntrenadorController
from .controllers.pasante_controller import PasanteController
from .controllers.administrador_controller import AdministradorController
from .controllers.atleta_controller import AtletaController
from .controllers.grupo_atleta_controller import GrupoAtletaController
from .controllers.inscripcion_controller import InscripcionController
from .controllers.prueba_antropometrica_controller import PruebaAntropometricaController
from .controllers.prueba_fisica_controller import PruebaFisicaController

router = DefaultRouter()
router.register(r'entrenadores', EntrenadorController, basename='entrenador')
router.register(r'pasantes', PasanteController, basename='pasante')
router.register(r'administradores', AdministradorController, basename='administrador')
router.register(r'atletas', AtletaController, basename='atleta')
router.register(r'grupos-atletas', GrupoAtletaController, basename='grupo-atleta')
router.register(r'inscripciones', InscripcionController, basename='inscripcion')
router.register(r'pruebas-antropometricas', PruebaAntropometricaController, basename='prueba-antropometrica')
router.register(r'pruebas-fisicas', PruebaFisicaController, basename='prueba-fisica')

urlpatterns = [
    path('', include(router.urls)),
]
