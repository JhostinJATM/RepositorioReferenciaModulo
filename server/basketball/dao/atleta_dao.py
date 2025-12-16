"""
DAO para el modelo Atleta
"""

from typing import Optional, List
from django.db.models import QuerySet
from .generic_dao import GenericDAO
from ..models import Atleta


class AtletaDAO(GenericDAO[Atleta]):
    """DAO para operaciones CRUD de Atleta"""
    
    model = Atleta
    
    def get_by_dni(self, dni: str) -> Optional[Atleta]:
        """
        Obtiene un atleta por su DNI.
        
        Args:
            dni: DNI del atleta
            
        Returns:
            Atleta | None: Instancia encontrada o None
        """
        return self.get_first(dni=dni)
    
    def get_activos(self) -> QuerySet[Atleta]:
        """
        Obtiene todos los atletas activos.
        
        Returns:
            QuerySet[Atleta]: QuerySet con atletas activos
        """
        return self.get_by_filter(estado=True)
    
    def get_by_sexo(self, sexo: str) -> QuerySet[Atleta]:
        """
        Obtiene atletas por sexo.
        
        Args:
            sexo: M, F u O
            
        Returns:
            QuerySet[Atleta]: QuerySet con atletas del sexo especificado
        """
        return self.get_by_filter(sexo=sexo, estado=True)
    
    def get_by_rango_edad(self, edad_min: int, edad_max: int) -> QuerySet[Atleta]:
        """
        Obtiene atletas por rango de edad.
        
        Args:
            edad_min: Edad mínima
            edad_max: Edad máxima
            
        Returns:
            QuerySet[Atleta]: QuerySet con atletas en el rango de edad
        """
        return self.get_by_filter(
            edad__gte=edad_min,
            edad__lte=edad_max,
            estado=True
        )
    
    def get_by_grupo(self, grupo_id: int) -> QuerySet[Atleta]:
        """
        Obtiene atletas de un grupo específico.
        
        Args:
            grupo_id: ID del grupo
            
        Returns:
            QuerySet[Atleta]: QuerySet con atletas del grupo
        """
        return self.get_by_filter(grupos__id=grupo_id, estado=True)
    
    def get_sin_grupo(self) -> QuerySet[Atleta]:
        """
        Obtiene atletas que no están asignados a ningún grupo.
        
        Returns:
            QuerySet[Atleta]: QuerySet con atletas sin grupo
        """
        return self.model.objects.filter(grupos__isnull=True, estado=True)
    
    def get_sin_inscripcion(self) -> QuerySet[Atleta]:
        """
        Obtiene atletas que no tienen inscripción.
        
        Returns:
            QuerySet[Atleta]: QuerySet con atletas sin inscripción
        """
        return self.model.objects.filter(inscripcion__isnull=True, estado=True)
    
    def search_atletas(self, search_term: str) -> QuerySet[Atleta]:
        """
        Busca atletas por término en nombre, apellido o DNI.
        
        Args:
            search_term: Término de búsqueda
            
        Returns:
            QuerySet[Atleta]: QuerySet con resultados
        """
        return self.search(
            search_fields=['nombre_atleta', 'apellido_atleta', 'dni', 'email'],
            search_term=search_term
        )
    
    def exists_dni(self, dni: str, exclude_id: int = None) -> bool:
        """
        Verifica si ya existe un atleta con el DNI dado.
        
        Args:
            dni: DNI a verificar
            exclude_id: ID a excluir de la búsqueda (útil para updates)
            
        Returns:
            bool: True si existe
        """
        queryset = self.model.objects.filter(dni=dni)
        if exclude_id:
            queryset = queryset.exclude(pk=exclude_id)
        return queryset.exists()
    
    def asignar_grupo(self, atleta_id: int, grupo_id: int) -> bool:
        """
        Asigna un atleta a un grupo.
        
        Args:
            atleta_id: ID del atleta
            grupo_id: ID del grupo
            
        Returns:
            bool: True si se asignó correctamente
        """
        try:
            atleta = self.get_by_id(atleta_id)
            if atleta:
                atleta.grupos.add(grupo_id)
                return True
            return False
        except Exception:
            return False
    
    def remover_grupo(self, atleta_id: int, grupo_id: int) -> bool:
        """
        Remueve un atleta de un grupo.
        
        Args:
            atleta_id: ID del atleta
            grupo_id: ID del grupo
            
        Returns:
            bool: True si se removió correctamente
        """
        try:
            atleta = self.get_by_id(atleta_id)
            if atleta:
                atleta.grupos.remove(grupo_id)
                return True
            return False
        except Exception:
            return False
