"""
DAO para el modelo Pasante
"""

from typing import Optional
from django.db.models import QuerySet
from .generic_dao import GenericDAO
from ..models import Pasante


class PasanteDAO(GenericDAO[Pasante]):
    """DAO para operaciones CRUD de Pasante/Estudiante de Vinculación"""
    
    model = Pasante
    
    def get_by_persona_external(self, persona_external: str) -> Optional[Pasante]:
        """
        Obtiene un pasante por su persona_external.
        
        Args:
            persona_external: UUID externo de la persona
            
        Returns:
            Pasante | None: Instancia encontrada o None
        """
        return self.get_first(persona_external=persona_external)
    
    def get_activos(self) -> QuerySet[Pasante]:
        """
        Obtiene todos los pasantes activos.
        
        Returns:
            QuerySet[Pasante]: QuerySet con pasantes activos
        """
        return self.get_by_filter(estado=True)
    
    def get_by_carrera(self, carrera: str) -> QuerySet[Pasante]:
        """
        Obtiene pasantes por carrera.
        
        Args:
            carrera: Nombre de la carrera
            
        Returns:
            QuerySet[Pasante]: QuerySet con pasantes de la carrera
        """
        return self.get_by_filter(carrera__icontains=carrera, estado=True)
    
    def get_by_universidad(self, universidad: str) -> QuerySet[Pasante]:
        """
        Obtiene pasantes por universidad.
        
        Args:
            universidad: Nombre de la universidad
            
        Returns:
            QuerySet[Pasante]: QuerySet con pasantes de la universidad
        """
        return self.get_by_filter(universidad__icontains=universidad, estado=True)
    
    def get_by_semestre(self, semestre: str) -> QuerySet[Pasante]:
        """
        Obtiene pasantes por semestre.
        
        Args:
            semestre: Semestre
            
        Returns:
            QuerySet[Pasante]: QuerySet con pasantes del semestre
        """
        return self.get_by_filter(semestre=semestre, estado=True)
    
    def search_pasantes(self, search_term: str) -> QuerySet[Pasante]:
        """
        Busca pasantes por término en carrera, universidad o semestre.
        
        Args:
            search_term: Término de búsqueda
            
        Returns:
            QuerySet[Pasante]: QuerySet con resultados
        """
        return self.search(
            search_fields=['carrera', 'universidad', 'semestre', 'persona_external'],
            search_term=search_term
        )
    
    def exists_persona_external(self, persona_external: str) -> bool:
        """
        Verifica si ya existe un pasante con el persona_external dado.
        
        Args:
            persona_external: UUID externo de la persona
            
        Returns:
            bool: True si existe
        """
        return self.exists(persona_external=persona_external)
    
    def get_vigentes(self) -> QuerySet[Pasante]:
        """
        Obtiene pasantes con vinculación vigente (fecha_fin null o futura).
        
        Returns:
            QuerySet[Pasante]: QuerySet con pasantes vigentes
        """
        from django.utils import timezone
        from django.db.models import Q
        
        today = timezone.now().date()
        return self.get_by_q_filter(
            Q(estado=True) & (Q(fecha_fin__isnull=True) | Q(fecha_fin__gte=today))
        )
