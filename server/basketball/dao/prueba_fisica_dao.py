"""
DAO para el modelo PruebaFisica
"""

from typing import Optional
from django.db.models import QuerySet, Avg, Max, Min
from .generic_dao import GenericDAO
from ..models import PruebaFisica


class PruebaFisicaDAO(GenericDAO[PruebaFisica]):
    """DAO para operaciones CRUD de PruebaFisica"""
    
    model = PruebaFisica
    
    def get_by_atleta(self, atleta_id: int) -> QuerySet[PruebaFisica]:
        """
        Obtiene pruebas físicas de un atleta.
        
        Args:
            atleta_id: ID del atleta
            
        Returns:
            QuerySet[PruebaFisica]: QuerySet con pruebas del atleta
        """
        return self.get_by_filter(atleta_id=atleta_id, estado=True)
    
    def get_by_atleta_y_tipo(self, atleta_id: int, tipo_prueba: str) -> QuerySet[PruebaFisica]:
        """
        Obtiene pruebas físicas de un atleta por tipo.
        
        Args:
            atleta_id: ID del atleta
            tipo_prueba: Tipo de prueba física
            
        Returns:
            QuerySet[PruebaFisica]: QuerySet con pruebas
        """
        return self.get_by_filter(atleta_id=atleta_id, tipo_prueba=tipo_prueba, estado=True)
    
    def get_ultima_by_atleta(self, atleta_id: int) -> Optional[PruebaFisica]:
        """
        Obtiene la última prueba física de un atleta.
        
        Args:
            atleta_id: ID del atleta
            
        Returns:
            PruebaFisica | None: Última prueba o None
        """
        return self.get_by_filter(atleta_id=atleta_id, estado=True).order_by('-fecha_registro').first()
    
    def get_activas(self) -> QuerySet[PruebaFisica]:
        """
        Obtiene todas las pruebas activas.
        
        Returns:
            QuerySet[PruebaFisica]: QuerySet con pruebas activas
        """
        return self.get_by_filter(estado=True)
    
    def get_by_tipo(self, tipo_prueba: str) -> QuerySet[PruebaFisica]:
        """
        Obtiene pruebas por tipo.
        
        Args:
            tipo_prueba: Tipo de prueba (VELOCIDAD, RESISTENCIA, etc.)
            
        Returns:
            QuerySet[PruebaFisica]: QuerySet con pruebas del tipo
        """
        return self.get_by_filter(tipo_prueba=tipo_prueba, estado=True)
    
    def get_by_fecha_range(self, fecha_inicio, fecha_fin) -> QuerySet[PruebaFisica]:
        """
        Obtiene pruebas en un rango de fechas.
        
        Args:
            fecha_inicio: Fecha de inicio
            fecha_fin: Fecha de fin
            
        Returns:
            QuerySet[PruebaFisica]: QuerySet con pruebas en el rango
        """
        return self.get_by_filter(
            fecha_registro__gte=fecha_inicio,
            fecha_registro__lte=fecha_fin,
            estado=True
        )
    
    def get_by_registrador(self, registrado_por: str) -> QuerySet[PruebaFisica]:
        """
        Obtiene pruebas registradas por un usuario específico.
        
        Args:
            registrado_por: External ID del usuario que registró
            
        Returns:
            QuerySet[PruebaFisica]: QuerySet con pruebas
        """
        return self.get_by_filter(registrado_por=registrado_por, estado=True)
    
    def get_estadisticas_atleta(self, atleta_id: int):
        """
        Obtiene estadísticas de pruebas físicas de un atleta.
        
        Args:
            atleta_id: ID del atleta
            
        Returns:
            dict: Estadísticas del atleta por tipo de prueba
        """
        pruebas = self.get_by_atleta(atleta_id)
        
        if not pruebas.exists():
            return None
        
        # Agrupar por tipo de prueba
        estadisticas = {}
        tipos = pruebas.values_list('tipo_prueba', flat=True).distinct()
        
        for tipo in tipos:
            pruebas_tipo = pruebas.filter(tipo_prueba=tipo)
            estadisticas[tipo] = {
                'total': pruebas_tipo.count(),
                'resultado_min': pruebas_tipo.aggregate(Min('resultado'))['resultado__min'],
                'resultado_max': pruebas_tipo.aggregate(Max('resultado'))['resultado__max'],
                'resultado_promedio': pruebas_tipo.aggregate(Avg('resultado'))['resultado__avg'],
            }
        
        return estadisticas
    
    def get_ranking_by_tipo(self, tipo_prueba: str, limit: int = 10):
        """
        Obtiene el ranking de atletas por tipo de prueba.
        
        Args:
            tipo_prueba: Tipo de prueba
            limit: Cantidad de resultados
            
        Returns:
            QuerySet: Ranking de atletas
        """
        return self.model.objects.filter(
            tipo_prueba=tipo_prueba,
            estado=True
        ).order_by('-resultado')[:limit]
    
    def search_pruebas(self, search_term: str) -> QuerySet[PruebaFisica]:
        """
        Busca pruebas por término en datos del atleta o tipo.
        
        Args:
            search_term: Término de búsqueda
            
        Returns:
            QuerySet[PruebaFisica]: QuerySet con resultados
        """
        from django.db.models import Q
        
        return self.model.objects.filter(
            Q(atleta__nombre_atleta__icontains=search_term) |
            Q(atleta__apellido_atleta__icontains=search_term) |
            Q(atleta__dni__icontains=search_term) |
            Q(tipo_prueba__icontains=search_term) |
            Q(nombre_prueba__icontains=search_term) |
            Q(observaciones__icontains=search_term),
            estado=True
        )
