"""
DAO para el modelo Inscripcion
"""

from typing import Optional
from django.db.models import QuerySet
from .generic_dao import GenericDAO
from ..models import Inscripcion


class InscripcionDAO(GenericDAO[Inscripcion]):
    """DAO para operaciones CRUD de Inscripcion"""
    
    model = Inscripcion
    
    def get_by_atleta(self, atleta_id: int) -> Optional[Inscripcion]:
        """
        Obtiene la inscripción de un atleta.
        
        Args:
            atleta_id: ID del atleta
            
        Returns:
            Inscripcion | None: Inscripción encontrada o None
        """
        return self.get_first(atleta_id=atleta_id)
    
    def get_habilitadas(self) -> QuerySet[Inscripcion]:
        """
        Obtiene todas las inscripciones habilitadas.
        
        Returns:
            QuerySet[Inscripcion]: QuerySet con inscripciones habilitadas
        """
        return self.get_by_filter(habilitada=True)
    
    def get_by_tipo(self, tipo: str) -> QuerySet[Inscripcion]:
        """
        Obtiene inscripciones por tipo.
        
        Args:
            tipo: Tipo de inscripción (FEDERADO, NO_FEDERADO, INVITADO)
            
        Returns:
            QuerySet[Inscripcion]: QuerySet con inscripciones del tipo
        """
        return self.get_by_filter(tipo_inscripcion=tipo, habilitada=True)
    
    def get_by_fecha_range(self, fecha_inicio, fecha_fin) -> QuerySet[Inscripcion]:
        """
        Obtiene inscripciones en un rango de fechas.
        
        Args:
            fecha_inicio: Fecha de inicio
            fecha_fin: Fecha de fin
            
        Returns:
            QuerySet[Inscripcion]: QuerySet con inscripciones en el rango
        """
        return self.get_by_filter(
            fecha_inscripcion__gte=fecha_inicio,
            fecha_inscripcion__lte=fecha_fin
        )
    
    def get_by_registrador(self, registrado_por: str) -> QuerySet[Inscripcion]:
        """
        Obtiene inscripciones registradas por un usuario específico.
        
        Args:
            registrado_por: External ID del usuario que registró
            
        Returns:
            QuerySet[Inscripcion]: QuerySet con inscripciones
        """
        return self.get_by_filter(registrado_por=registrado_por)
    
    def exists_atleta_inscrito(self, atleta_id: int) -> bool:
        """
        Verifica si un atleta ya tiene inscripción.
        
        Args:
            atleta_id: ID del atleta
            
        Returns:
            bool: True si ya tiene inscripción
        """
        return self.exists(atleta_id=atleta_id)
    
    def habilitar_inscripcion(self, pk: int) -> bool:
        """
        Habilita una inscripción.
        
        Args:
            pk: ID de la inscripción
            
        Returns:
            bool: True si se habilitó correctamente
        """
        inscripcion = self.update(pk, habilitada=True)
        return inscripcion is not None
    
    def deshabilitar_inscripcion(self, pk: int) -> bool:
        """
        Deshabilita una inscripción.
        
        Args:
            pk: ID de la inscripción
            
        Returns:
            bool: True si se deshabilitó correctamente
        """
        inscripcion = self.update(pk, habilitada=False)
        return inscripcion is not None
    
    def search_inscripciones(self, search_term: str) -> QuerySet[Inscripcion]:
        """
        Busca inscripciones por término en datos del atleta.
        
        Args:
            search_term: Término de búsqueda
            
        Returns:
            QuerySet[Inscripcion]: QuerySet con resultados
        """
        from django.db.models import Q
        
        return self.model.objects.filter(
            Q(atleta__nombre_atleta__icontains=search_term) |
            Q(atleta__apellido_atleta__icontains=search_term) |
            Q(atleta__dni__icontains=search_term) |
            Q(tipo_inscripcion__icontains=search_term)
        )
