"""
DAO para el modelo PruebaAntropometrica
"""

from typing import Optional
from django.db.models import QuerySet, Avg
from .generic_dao import GenericDAO
from ..models import PruebaAntropometrica


class PruebaAntropometricaDAO(GenericDAO[PruebaAntropometrica]):
    """DAO para operaciones CRUD de PruebaAntropometrica"""
    
    model = PruebaAntropometrica
    
    def get_by_atleta(self, atleta_id: int) -> QuerySet[PruebaAntropometrica]:
        """
        Obtiene pruebas antropométricas de un atleta.
        
        Args:
            atleta_id: ID del atleta
            
        Returns:
            QuerySet[PruebaAntropometrica]: QuerySet con pruebas del atleta
        """
        return self.get_by_filter(atleta_id=atleta_id, estado=True)
    
    def get_ultima_by_atleta(self, atleta_id: int) -> Optional[PruebaAntropometrica]:
        """
        Obtiene la última prueba antropométrica de un atleta.
        
        Args:
            atleta_id: ID del atleta
            
        Returns:
            PruebaAntropometrica | None: Última prueba o None
        """
        return self.get_by_filter(atleta_id=atleta_id, estado=True).order_by('-fecha_registro').first()
    
    def get_activas(self) -> QuerySet[PruebaAntropometrica]:
        """
        Obtiene todas las pruebas activas.
        
        Returns:
            QuerySet[PruebaAntropometrica]: QuerySet con pruebas activas
        """
        return self.get_by_filter(estado=True)
    
    def get_by_fecha_range(self, fecha_inicio, fecha_fin) -> QuerySet[PruebaAntropometrica]:
        """
        Obtiene pruebas en un rango de fechas.
        
        Args:
            fecha_inicio: Fecha de inicio
            fecha_fin: Fecha de fin
            
        Returns:
            QuerySet[PruebaAntropometrica]: QuerySet con pruebas en el rango
        """
        return self.get_by_filter(
            fecha_registro__gte=fecha_inicio,
            fecha_registro__lte=fecha_fin,
            estado=True
        )
    
    def get_by_registrador(self, registrado_por: str) -> QuerySet[PruebaAntropometrica]:
        """
        Obtiene pruebas registradas por un usuario específico.
        
        Args:
            registrado_por: External ID del usuario que registró
            
        Returns:
            QuerySet[PruebaAntropometrica]: QuerySet con pruebas
        """
        return self.get_by_filter(registrado_por=registrado_por, estado=True)
    
    def get_promedio_imc_by_grupo(self, grupo_id: int):
        """
        Obtiene el promedio de IMC de atletas de un grupo.
        
        Args:
            grupo_id: ID del grupo
            
        Returns:
            float | None: Promedio de IMC
        """
        return self.model.objects.filter(
            atleta__grupos__id=grupo_id,
            estado=True
        ).aggregate(promedio_imc=Avg('indice_masa_corporal'))['promedio_imc']
    
    def get_estadisticas_atleta(self, atleta_id: int):
        """
        Obtiene estadísticas de pruebas antropométricas de un atleta.
        
        Args:
            atleta_id: ID del atleta
            
        Returns:
            dict: Estadísticas del atleta
        """
        from django.db.models import Min, Max
        
        pruebas = self.get_by_atleta(atleta_id)
        
        if not pruebas.exists():
            return None
        
        stats = pruebas.aggregate(
            peso_min=Min('peso'),
            peso_max=Max('peso'),
            peso_promedio=Avg('peso'),
            estatura_min=Min('estatura'),
            estatura_max=Max('estatura'),
            imc_min=Min('indice_masa_corporal'),
            imc_max=Max('indice_masa_corporal'),
            imc_promedio=Avg('indice_masa_corporal')
        )
        stats['total_pruebas'] = pruebas.count()
        
        return stats
    
    def search_pruebas(self, search_term: str) -> QuerySet[PruebaAntropometrica]:
        """
        Busca pruebas por término en datos del atleta.
        
        Args:
            search_term: Término de búsqueda
            
        Returns:
            QuerySet[PruebaAntropometrica]: QuerySet con resultados
        """
        from django.db.models import Q
        
        return self.model.objects.filter(
            Q(atleta__nombre_atleta__icontains=search_term) |
            Q(atleta__apellido_atleta__icontains=search_term) |
            Q(atleta__dni__icontains=search_term) |
            Q(observaciones__icontains=search_term),
            estado=True
        )
