"""
DAO para el modelo Administrador
"""

from typing import Optional
from django.db.models import QuerySet
from .generic_dao import GenericDAO
from ..models import Administrador


class AdministradorDAO(GenericDAO[Administrador]):
    """DAO para operaciones CRUD de Administrador"""
    
    model = Administrador
    
    def get_by_persona_external(self, persona_external: str) -> Optional[Administrador]:
        """
        Obtiene un administrador por su persona_external.
        
        Args:
            persona_external: UUID externo de la persona
            
        Returns:
            Administrador | None: Administrador encontrado o None
        """
        return self.get_first(persona_external=persona_external, estado=True)
    
    def get_activos(self) -> QuerySet[Administrador]:
        """
        Obtiene todos los administradores activos.
        
        Returns:
            QuerySet[Administrador]: QuerySet con administradores activos
        """
        return self.get_by_filter(estado=True)
