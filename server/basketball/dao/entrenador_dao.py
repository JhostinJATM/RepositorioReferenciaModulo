"""
DAO para el modelo Entrenador
"""

from typing import Optional, List
from django.db.models import QuerySet
from .generic_dao import GenericDAO
from ..models import Entrenador


class EntrenadorDAO(GenericDAO[Entrenador]):
    """DAO para operaciones CRUD de Entrenador"""
    
    model = Entrenador
    
    def get_by_persona_external(self, persona_external: str) -> Optional[Entrenador]:
        """
        Obtiene un entrenador por su persona_external.
        
        Args:
            persona_external: UUID externo de la persona
            
        Returns:
            Entrenador | None: Instancia encontrada o None
        """
        return self.get_first(persona_external=persona_external)
    
    def get_activos(self) -> QuerySet[Entrenador]:
        """
        Obtiene todos los entrenadores activos.
        
        Returns:
            QuerySet[Entrenador]: QuerySet con entrenadores activos
        """
        return self.get_by_filter(estado=True)
    
    def get_by_club(self, club: str) -> QuerySet[Entrenador]:
        """
        Obtiene entrenadores por club asignado.
        
        Args:
            club: Nombre del club
            
        Returns:
            QuerySet[Entrenador]: QuerySet con entrenadores del club
        """
        return self.get_by_filter(club_asignado__icontains=club, estado=True)
    
    def get_by_especialidad(self, especialidad: str) -> QuerySet[Entrenador]:
        """
        Obtiene entrenadores por especialidad.
        
        Args:
            especialidad: Especialidad del entrenador
            
        Returns:
            QuerySet[Entrenador]: QuerySet con entrenadores de la especialidad
        """
        return self.get_by_filter(especialidad__icontains=especialidad, estado=True)
    
    def search_entrenadores(self, search_term: str) -> QuerySet[Entrenador]:
        """
        Busca entrenadores por término en especialidad o club.
        
        Args:
            search_term: Término de búsqueda
            
        Returns:
            QuerySet[Entrenador]: QuerySet con resultados
        """
        return self.search(
            search_fields=['especialidad', 'club_asignado', 'persona_external'],
            search_term=search_term
        )
    
    def exists_persona_external(self, persona_external: str) -> bool:
        """
        Verifica si ya existe un entrenador con el persona_external dado.
        
        Args:
            persona_external: UUID externo de la persona
            
        Returns:
            bool: True si existe
        """
        return self.exists(persona_external=persona_external)
