from rest_framework.test import APITestCase
from rest_framework import status
import jwt
from django.conf import settings
from ..models import Entrenador

class BaseTestCase(APITestCase):
    def setUp(self):
        self.secret_key = '1234567FDUCAMETB'
        
    def get_token(self, role='ADMIN'):
        payload = {
            'role': role,
            'stament': role,
            'type_stament': role
        }
        return jwt.encode(payload, self.secret_key, algorithm='HS256')
        
    def authenticate(self, role='ADMIN'):
        token = self.get_token(role)
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + token)

class EntrenadorTests(BaseTestCase):
    def setUp(self):
        super().setUp()
        self.entrenador_data = {
            'persona_external': 'uuid-1234-5678',
            'especialidad': 'Baloncesto',
            'club_asignado': 'Club A'
        }
        
    def test_create_entrenador_admin(self):
        self.authenticate('ADMIN')
        response = self.client.post('/api/v1/entrenadores/', self.entrenador_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Entrenador.objects.count(), 1)
        self.assertEqual(Entrenador.objects.get().persona_external, 'uuid-1234-5678')
        
    def test_create_entrenador_no_admin(self):
        self.authenticate('ENTRENADOR')
        response = self.client.post('/api/v1/entrenadores/', self.entrenador_data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_list_entrenadores(self):
        self.authenticate('ADMIN')
        Entrenador.objects.create(**self.entrenador_data)
        response = self.client.get('/api/v1/entrenadores/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
