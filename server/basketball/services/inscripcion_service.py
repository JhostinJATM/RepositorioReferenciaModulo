"""
Servicio para la gestión de Inscripciones
"""

import logging
from typing import List, Optional, Dict, Any
from django.core.exceptions import ValidationError
from ..dao.inscripcion_dao import InscripcionDAO
from ..models import Inscripcion

logger = logging.getLogger(__name__)


class InscripcionService:
    """Servicio que encapsula la lógica de negocio para Inscripciones"""
    
    def __init__(self):
        self.dao = InscripcionDAO()
    
    def create_inscripcion(self, data: Dict[str, Any]) -> Inscripcion:
        """
        Crea una nueva inscripción.
        
        Args:
            data: Diccionario con los datos de la inscripción
            
        Returns:
            Inscripcion: Instancia creada
            
        Raises:
            ValidationError: Si los datos no son válidos
        """
        atleta_id = data.get('atleta_id') or data.get('atleta')
        if not atleta_id:
            raise ValidationError("El atleta es obligatorio")
            
        # Verificar si es un objeto o un ID
        if hasattr(atleta_id, 'pk'):
            atleta_id = atleta_id.pk
            
        if self.dao.exists_atleta_inscrito(atleta_id):
            raise ValidationError(f"El atleta con ID {atleta_id} ya tiene una inscripción activa")
            
        return self.dao.create(**data)
    
    def update_inscripcion(self, pk: int, data: Dict[str, Any]) -> Optional[Inscripcion]:
        """
        Actualiza una inscripción existente.
        
        Args:
            pk: ID de la inscripción
            data: Datos a actualizar
            
        Returns:
            Inscripcion | None: Instancia actualizada
        """
        return self.dao.update(pk, **data)
    
    def delete_inscripcion(self, pk: int) -> bool:
        """
        Elimina (soft delete/deshabilitar) una inscripción.
        
        Args:
            pk: ID de la inscripción
            
        Returns:
            bool: True si se eliminó correctamente
        """
        return self.dao.deshabilitar_inscripcion(pk)
    
    def get_inscripcion_by_id(self, pk: int) -> Optional[Inscripcion]:
        """Obtiene una inscripción por ID"""
        return self.dao.get_by_id(pk)
    
    def get_all_inscripciones(self) -> List[Inscripcion]:
        """Obtiene todas las inscripciones habilitadas"""
        return list(self.dao.get_habilitadas())
    
    def search_inscripciones(self, search_term: str) -> List[Inscripcion]:
        """Busca inscripciones por término"""
        return list(self.dao.search_inscripciones(search_term))
