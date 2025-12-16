import jwt
from rest_framework import permissions
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

# Clave secreta del módulo de usuarios (debe coincidir con OTHERS_KEY del docker-compose)
# En producción esto debería estar en variables de entorno
JWT_SECRET_KEY = '1234567FDUCAMETB'

def map_stament_to_role(value):
    if not value:
        return None
    normalized = str(value).upper()
    if 'ADMIN' in normalized:
        return 'ADMIN'
    if 'DOCENTE' in normalized or 'ENTRENADOR' in normalized:
        return 'ENTRENADOR'
    if 'ESTUDIANT' in normalized:
        return 'ESTUDIANTE_VINCULACION'
    return None


class BaseRolePermission(permissions.BasePermission):
    """
    Verifica rol desde:
      1) Header 'X-Role' o 'Role' (enviado por el frontend)
      2) Token JWT (si es JWT válido)
    """
    allowed_roles = []

    def _is_allowed(self, role_value: str) -> bool:
        if not role_value:
            return False
        role = map_stament_to_role(role_value) or str(role_value).upper()

        if 'ADMIN' in self.allowed_roles and role == 'ADMIN':
            return True
        if 'ENTRENADOR' in self.allowed_roles and role == 'ENTRENADOR':
            return True
        if 'ESTUDIANTE_VINCULACION' in self.allowed_roles and role == 'ESTUDIANTE_VINCULACION':
            return True
        return False

    def has_permission(self, request, view):
        # 1) Revisar header de rol directo (evita depender de JWT del módulo externo)
        header_role = request.headers.get('X-Role') or request.headers.get('Role')
        if header_role and self._is_allowed(header_role):
            return True

        # 2) Revisar Authorization Bearer
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return False

        token = auth_header.split(' ')[1]

        # Intentar decodificar solo si parece JWT (tres partes separadas por '.')
        if token.count('.') == 2:
            try:
                payload = jwt.decode(
                    token,
                    JWT_SECRET_KEY,
                    algorithms=['HS256'],
                    options={"verify_signature": False}
                )
                user_role = payload.get('role') or payload.get('stament') or payload.get('type_stament')
                if self._is_allowed(user_role):
                    return True
            except Exception as e:
                logger.error(f"Error validando token JWT: {e}")

        # Si no es JWT o no cumple rol
        return False

class IsAdmin(BaseRolePermission):
    allowed_roles = ['ADMIN']

class IsEntrenador(BaseRolePermission):
    allowed_roles = ['ENTRENADOR']

class IsPasante(BaseRolePermission):
    allowed_roles = ['ESTUDIANTE_VINCULACION']

class IsAdminOrEntrenadorOrPasante(BaseRolePermission):
    allowed_roles = ['ADMIN', 'ENTRENADOR', 'ESTUDIANTE_VINCULACION']

class IsEntrenadorOrAdmin(BaseRolePermission):
    allowed_roles = ['ENTRENADOR', 'ADMIN']

# Alias utilizado en controladores para acceso ampliado a grupos/atletas
IsAdminOrEntrenador = IsEntrenadorOrAdmin
