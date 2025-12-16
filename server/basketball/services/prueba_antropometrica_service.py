"""
Servicio para la gestión de Pruebas Antropométricas
"""

import logging
from typing import List, Optional, Dict, Any
from django.core.exceptions import ValidationError
from ..dao.prueba_antropometrica_dao import PruebaAntropometricaDAO
from ..models import PruebaAntropometrica

logger = logging.getLogger(__name__)


class PruebaAntropometricaService:
    """Servicio que encapsula la lógica de negocio para Pruebas Antropométricas"""
    
    def __init__(self):
        self.dao = PruebaAntropometricaDAO()
    
    def create_prueba(self, data: Dict[str, Any]) -> PruebaAntropometrica:
        """
        Crea una nueva prueba antropométrica.
        
        Args:
            data: Diccionario con los datos de la prueba
            
        Returns:
            PruebaAntropometrica: Instancia creada
            
        Raises:
            ValidationError: Si los datos no son válidos
        """
        # Validaciones adicionales si son necesarias
        peso = data.get('peso')
        estatura = data.get('estatura')
        
        if peso is not None and float(peso) <= 0:
            raise ValidationError("El peso debe ser mayor a 0")
            
        if estatura is not None and float(estatura) <= 0:
            raise ValidationError("La estatura debe ser mayor a 0")
            
        return self.dao.create(**data)
    
    def update_prueba(self, pk: int, data: Dict[str, Any]) -> Optional[PruebaAntropometrica]:
        """
        Actualiza una prueba existente.
        
        Args:
            pk: ID de la prueba
            data: Datos a actualizar
            
        Returns:
            PruebaAntropometrica | None: Instancia actualizada
        """
        return self.dao.update(pk, **data)
    
    def delete_prueba(self, pk: int) -> bool:
        """
        Elimina (soft delete) una prueba.
        
        Args:
            pk: ID de la prueba
            
        Returns:
            bool: True si se eliminó correctamente
        """
        return self.dao.soft_delete(pk)
    
    def get_prueba_by_id(self, pk: int) -> Optional[PruebaAntropometrica]:
        """Obtiene una prueba por ID"""
        return self.dao.get_by_id(pk)
    
    def get_all_pruebas(self) -> List[PruebaAntropometrica]:
        """Obtiene todas las pruebas activas"""
        return list(self.dao.get_activas())
    
    def get_pruebas_by_atleta(self, atleta_id: int) -> List[PruebaAntropometrica]:
        """Obtiene pruebas de un atleta"""
        return list(self.dao.get_by_atleta(atleta_id))
    
    def search_pruebas(self, search_term: str) -> List[PruebaAntropometrica]:
        """Busca pruebas por término"""
        return list(self.dao.search_pruebas(search_term))
