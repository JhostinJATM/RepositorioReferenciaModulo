from rest_framework import status
from .test_entrenador import BaseTestCase
from ..models import GrupoAtleta, Entrenador

class GrupoAtletaTests(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.entrenador = Entrenador.objects.create(
            persona_external='uuid-entrenador',
            especialidad='Basket',
            club_asignado='Club'
        )
        self.grupo_data = {
            'nombre': 'Grupo A',
            'rango_edad_minima': 10,
            'rango_edad_maxima': 15,
            'categoria': 'Infantil',
            'entrenador': self.entrenador.id
        }
        
    def test_create_grupo_entrenador(self):
        self.authenticate('ENTRENADOR')
        response = self.client.post('/api/v1/grupos-atletas/', self.grupo_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(GrupoAtleta.objects.count(), 1)
        
    def test_create_grupo_pasante(self):
        self.authenticate('PASANTE')
        response = self.client.post('/api/v1/grupos-atletas/', self.grupo_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
