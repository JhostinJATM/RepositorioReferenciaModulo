from rest_framework import status
from .test_entrenador import BaseTestCase
from ..models import Atleta

class AtletaTests(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.atleta_data = {
            'nombre_atleta': 'Juan',
            'apellido_atleta': 'Perez',
            'dni': '1234567890',
            'fecha_nacimiento': '2005-01-01',
            'edad': 18,
            'sexo': 'M'
        }
        
    def test_create_atleta_entrenador(self):
        self.authenticate('ENTRENADOR')
        response = self.client.post('/api/v1/atletas/', self.atleta_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Atleta.objects.count(), 1)
        
    def test_create_atleta_pasante(self):
        self.authenticate('PASANTE')
        response = self.client.post('/api/v1/atletas/', self.atleta_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    def test_create_atleta_duplicate_dni(self):
        self.authenticate('ADMIN')
        self.client.post('/api/v1/atletas/', self.atleta_data)
        response = self.client.post('/api/v1/atletas/', self.atleta_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
