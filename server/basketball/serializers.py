from rest_framework import serializers
from .models import (
    Entrenador, Pasante, Administrador, GrupoAtleta, Atleta,
    Inscripcion, PruebaAntropometrica, PruebaFisica
)
import requests
import os

# Cache global para tokens y datos de persona
_user_module_token = None
_persona_cache = {}

def get_user_module_token():
    """Obtiene token del user_module con cache"""
    global _user_module_token
    if _user_module_token:
        return _user_module_token
    
    try:
        user_module_url = os.environ.get('USER_MODULE_URL', 'http://localhost:8096')
        response = requests.post(
            f'{user_module_url}/api/person/login',
            json={'email': 'admin@admin.com', 'password': 'admin123'},
            timeout=5
        )
        if response.status_code == 200:
            token = response.json().get('data', {}).get('token', '')
            # El token ya viene con el prefijo "Bearer "
            _user_module_token = token.replace('Bearer ', '') if token.startswith('Bearer ') else token
            return _user_module_token
    except Exception as e:
        print(f"Error obteniendo token: {e}")
    return None

def get_persona_from_user_module(persona_external):
    """Obtiene datos de persona del user_module con cache"""
    # Verificar cache
    if persona_external in _persona_cache:
        return _persona_cache[persona_external]
    
    token = get_user_module_token()
    if not token:
        return None
    
    try:
        user_module_url = os.environ.get('USER_MODULE_URL', 'http://localhost:8096')
        headers = {'Authorization': f'Bearer {token}'}
        response = requests.get(
            f'{user_module_url}/api/person/search_external/{persona_external}',
            headers=headers,
            timeout=5
        )
        
        if response.status_code == 200:
            persona_data = response.json().get('data', {})
            _persona_cache[persona_external] = persona_data
            return persona_data
        elif response.status_code == 401:
            # Token expiró, limpiar cache y reintentar
            global _user_module_token
            _user_module_token = None
            token = get_user_module_token()
            if token:
                headers = {'Authorization': f'Bearer {token}'}
                response = requests.get(
                    f'{user_module_url}/api/person/search_external/{persona_external}',
                    headers=headers,
                    timeout=5
                )
                if response.status_code == 200:
                    persona_data = response.json().get('data', {})
                    _persona_cache[persona_external] = persona_data
                    return persona_data
    except Exception as e:
        print(f"Error obteniendo datos de persona {persona_external}: {e}")
    
    return None

class EntrenadorSerializer(serializers.ModelSerializer):
    nombre = serializers.SerializerMethodField()
    apellido = serializers.SerializerMethodField()
    dni = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    telefono = serializers.SerializerMethodField()
    direccion = serializers.SerializerMethodField()
    
    class Meta:
        model = Entrenador
        fields = ['id', 'persona_external', 'especialidad', 'club_asignado', 
                  'fecha_registro', 'estado', 'nombre', 'apellido', 'dni', 
                  'email', 'telefono', 'direccion']
    
    def get_persona_data(self, obj):
        """Obtiene datos de persona con cache"""
        if not hasattr(self, '_persona_cache'):
            self._persona_cache = {}
        
        if obj.persona_external not in self._persona_cache:
            self._persona_cache[obj.persona_external] = get_persona_from_user_module(obj.persona_external)
        
        return self._persona_cache[obj.persona_external]
    
    def get_nombre(self, obj):
        persona = self.get_persona_data(obj)
        return persona.get('first_name', '') if persona else ''
    
    def get_apellido(self, obj):
        persona = self.get_persona_data(obj)
        return persona.get('last_name', '') if persona else ''
    
    def get_dni(self, obj):
        persona = self.get_persona_data(obj)
        return persona.get('identification', '') if persona else ''
    
    def get_email(self, obj):
        persona = self.get_persona_data(obj)
        return persona.get('email', '') if persona else ''
    
    def get_telefono(self, obj):
        persona = self.get_persona_data(obj)
        return persona.get('phono', '') if persona else ''
    
    def get_direccion(self, obj):
        persona = self.get_persona_data(obj)
        return persona.get('direction', '') if persona else ''

class PasanteSerializer(serializers.ModelSerializer):
    nombre = serializers.SerializerMethodField()
    apellido = serializers.SerializerMethodField()
    dni = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    telefono = serializers.SerializerMethodField()
    direccion = serializers.SerializerMethodField()
    
    class Meta:
        model = Pasante
        fields = ['id', 'persona_external', 'carrera', 'semestre', 'universidad',
                  'fecha_inicio', 'fecha_fin', 'fecha_registro', 'estado', 
                  'nombre', 'apellido', 'dni', 'email', 'telefono', 'direccion']
    
    def get_persona_data(self, obj):
        """Obtiene datos de persona con cache"""
        if not hasattr(self, '_persona_cache'):
            self._persona_cache = {}
        
        if obj.persona_external not in self._persona_cache:
            self._persona_cache[obj.persona_external] = get_persona_from_user_module(obj.persona_external)
        
        return self._persona_cache[obj.persona_external]
    
    def get_nombre(self, obj):
        persona = self.get_persona_data(obj)
        return persona.get('first_name', '') if persona else ''
    
    def get_apellido(self, obj):
        persona = self.get_persona_data(obj)
        return persona.get('last_name', '') if persona else ''
    
    def get_dni(self, obj):
        persona = self.get_persona_data(obj)
        return persona.get('identification', '') if persona else ''
    
    def get_email(self, obj):
        persona = self.get_persona_data(obj)
        return persona.get('email', '') if persona else ''
    
    def get_telefono(self, obj):
        persona = self.get_persona_data(obj)
        return persona.get('phono', '') if persona else ''
    
    def get_direccion(self, obj):
        persona = self.get_persona_data(obj)
        return persona.get('direction', '') if persona else ''

class AdministradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrador
        fields = '__all__'

class GrupoAtletaSerializer(serializers.ModelSerializer):
    class Meta:
        model = GrupoAtleta
        fields = '__all__'

class AtletaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Atleta
        fields = '__all__'

class InscripcionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inscripcion
        fields = '__all__'

class PruebaAntropometricaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PruebaAntropometrica
        fields = '__all__'

class PruebaFisicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = PruebaFisica
        fields = '__all__'
