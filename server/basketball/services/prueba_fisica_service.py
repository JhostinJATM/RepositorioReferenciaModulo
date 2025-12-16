"""
Servicio para la gestión de Pruebas Físicas
"""

import logging
from typing import List, Optional, Dict, Any
from django.core.exceptions import ValidationError
from ..dao.prueba_fisica_dao import PruebaFisicaDAO
from ..models import PruebaFisica

logger = logging.getLogger(__name__)


class PruebaFisicaService:
    """Servicio que encapsula la lógica de negocio para Pruebas Físicas"""
    
    def __init__(self):
        self.dao = PruebaFisicaDAO()
    
    def create_prueba(self, data: Dict[str, Any]) -> PruebaFisica:
        """
        Crea una nueva prueba física.
        
        Args:
            data: Diccionario con los datos de la prueba
            
        Returns:
            PruebaFisica: Instancia creada
            
        Raises:
            ValidationError: Si los datos no son válidos
        """
        # Validaciones adicionales
        resultado = data.get('resultado')
        if resultado is not None and float(resultado) < 0:
            raise ValidationError("El resultado no puede ser negativo")
            
        return self.dao.create(**data)
    
    def update_prueba(self, pk: int, data: Dict[str, Any]) -> Optional[PruebaFisica]:
        """
        Actualiza una prueba existente.
        
        Args:
            pk: ID de la prueba
            data: Datos a actualizar
            
        Returns:
            PruebaFisica | None: Instancia actualizada
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
    
    def get_prueba_by_id(self, pk: int) -> Optional[PruebaFisica]:
        """Obtiene una prueba por ID"""
        return self.dao.get_by_id(pk)
    
    def get_all_pruebas(self) -> List[PruebaFisica]:
        """Obtiene todas las pruebas activas"""
        return list(self.dao.get_activas())
    
    def get_pruebas_by_atleta(self, atleta_id: int) -> List[PruebaFisica]:
        """Obtiene pruebas de un atleta"""
        return list(self.dao.get_by_atleta(atleta_id))
    
    def search_pruebas(self, search_term: str) -> List[PruebaFisica]:
        """Busca pruebas por término"""
        return list(self.dao.search_pruebas(search_term))
