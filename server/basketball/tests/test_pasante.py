from rest_framework import status
from .test_entrenador import BaseTestCase
from ..models import Pasante

class PasanteTests(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.pasante_data = {
            'persona_external': 'uuid-pasante-1',
            'carrera': 'Entrenamiento Deportivo',
            'semestre': '5',
            'fecha_inicio': '2023-01-01'
        }
        
    def test_create_pasante_admin(self):
        self.authenticate('ADMIN')
        response = self.client.post('/api/v1/pasantes/', self.pasante_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Pasante.objects.count(), 1)
        
    def test_create_pasante_no_admin(self):
        self.authenticate('PASANTE')
        response = self.client.post('/api/v1/pasantes/', self.pasante_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
