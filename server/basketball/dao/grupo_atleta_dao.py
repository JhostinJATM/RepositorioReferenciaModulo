"""
DAO para el modelo GrupoAtleta
"""

from typing import Optional
from django.db.models import QuerySet, Count
from .generic_dao import GenericDAO
from ..models import GrupoAtleta


class GrupoAtletaDAO(GenericDAO[GrupoAtleta]):
    """DAO para operaciones CRUD de GrupoAtleta"""
    
    model = GrupoAtleta
    
    def get_activos(self) -> QuerySet[GrupoAtleta]:
        """
        Obtiene todos los grupos activos.
        
        Returns:
            QuerySet[GrupoAtleta]: QuerySet con grupos activos
        """
        return self.get_by_filter(estado=True)
    
    def get_by_entrenador(self, entrenador_id: int) -> QuerySet[GrupoAtleta]:
        """
        Obtiene grupos de un entrenador específico.
        
        Args:
            entrenador_id: ID del entrenador
            
        Returns:
            QuerySet[GrupoAtleta]: QuerySet con grupos del entrenador
        """
        return self.get_by_filter(entrenador_id=entrenador_id, estado=True)
    
    def get_by_entrenador_external(self, persona_external: str) -> QuerySet[GrupoAtleta]:
        """
        Obtiene grupos de un entrenador por su persona_external.
        
        Args:
            persona_external: External ID del entrenador
            
        Returns:
            QuerySet[GrupoAtleta]: QuerySet con grupos del entrenador
        """
        return self.get_by_filter(entrenador__persona_external=persona_external, estado=True)
    
    def get_by_categoria(self, categoria: str) -> QuerySet[GrupoAtleta]:
        """
        Obtiene grupos por categoría.
        
        Args:
            categoria: Categoría del grupo
            
        Returns:
            QuerySet[GrupoAtleta]: QuerySet con grupos de la categoría
        """
        return self.get_by_filter(categoria__icontains=categoria, estado=True)
    
    def get_by_rango_edad(self, edad: int) -> QuerySet[GrupoAtleta]:
        """
        Obtiene grupos donde la edad especificada está dentro del rango.
        
        Args:
            edad: Edad a verificar
            
        Returns:
            QuerySet[GrupoAtleta]: QuerySet con grupos que aceptan esa edad
        """
        return self.get_by_filter(
            rango_edad_minima__lte=edad,
            rango_edad_maxima__gte=edad,
            estado=True
        )
    
    def get_con_atletas_count(self) -> QuerySet[GrupoAtleta]:
        """
        Obtiene grupos con conteo de atletas.
        
        Returns:
            QuerySet[GrupoAtleta]: QuerySet con anotación de cantidad de atletas
        """
        return self.model.objects.filter(estado=True).annotate(
            cantidad_atletas=Count('atletas')
        )
    
    def search_grupos(self, search_term: str) -> QuerySet[GrupoAtleta]:
        """
        Busca grupos por término en nombre o categoría.
        
        Args:
            search_term: Término de búsqueda
            
        Returns:
            QuerySet[GrupoAtleta]: QuerySet con resultados
        """
        return self.search(
            search_fields=['nombre', 'categoria', 'descripcion'],
            search_term=search_term
        )
    
    def validate_rango_edad(self, rango_min: int, rango_max: int) -> bool:
        """
        Valida que el rango de edad sea válido.
        
        Args:
            rango_min: Edad mínima
            rango_max: Edad máxima
            
        Returns:
            bool: True si el rango es válido
        """
        return rango_min >= 0 and rango_max > rango_min
