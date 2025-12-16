from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import jwt
from django.conf import settings
import uuid

# Create your views here.

class MockAuthView(APIView):
    """
    Mock Auth View para simular el login del user_module.
    Genera tokens JWT firmados con la SECRET_KEY de Django.
    """
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        # Validar que se recibieron los datos
        if not username or not password:
            return Response({
                'error': 'Usuario y contraseña son requeridos'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Buscar usuario en las tablas correspondientes
        from .models import Administrador, Entrenador, Pasante
        
        user = None
        role = None
        persona_external = None
        
        # Buscar en Administrador
        try:
            admin = Administrador.objects.get(persona_external=username, estado=True)
            if username and password == 'admin123':  # Simplificado para demo
                user = {'username': username}
                role = 'ADMIN'
                persona_external = admin.persona_external
        except Administrador.DoesNotExist:
            pass
        
        # Buscar en Entrenador
        if not user:
            try:
                entrenador = Entrenador.objects.get(persona_external=username, estado=True)
                if username and password == 'entrenador123':  # Simplificado para demo
                    user = {'username': username}
                    role = 'ENTRENADOR'
                    persona_external = entrenador.persona_external
            except Entrenador.DoesNotExist:
                pass
        
        # Buscar en Pasante
        if not user:
            try:
                pasante = Pasante.objects.get(persona_external=username, estado=True)
                if username and password == 'pasante123':  # Simplificado para demo
                    user = {'username': username}
                    role = 'PASANTE'
                    persona_external = pasante.persona_external
            except Pasante.DoesNotExist:
                pass

        if user and role and persona_external:
            payload = {
                'role': role,
                'stament': role,
                'type_stament': role,
                'persona_external': persona_external,
                'sub': username
            }
            token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
            
            # Si es bytes (dependiendo de la versión de pyjwt), decodificar
            if isinstance(token, bytes):
                token = token.decode('utf-8')

            return Response({
                'token': token,
                'accessToken': token,
                'user': {
                    'username': username,
                    'role': role
                }
            }, status=status.HTTP_200_OK)

        return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)

