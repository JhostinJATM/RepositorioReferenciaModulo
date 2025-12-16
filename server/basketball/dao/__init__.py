from .generic_dao import GenericDAO
from .entrenador_dao import EntrenadorDAO
from .pasante_dao import PasanteDAO
from .atleta_dao import AtletaDAO
from .grupo_atleta_dao import GrupoAtletaDAO
from .inscripcion_dao import InscripcionDAO
from .prueba_antropometrica_dao import PruebaAntropometricaDAO
from .prueba_fisica_dao import PruebaFisicaDAO

__all__ = [
    'GenericDAO',
    'EntrenadorDAO',
    'PasanteDAO',
    'AtletaDAO',
    'GrupoAtletaDAO',
    'InscripcionDAO',
    'PruebaAntropometricaDAO',
    'PruebaFisicaDAO',
]
