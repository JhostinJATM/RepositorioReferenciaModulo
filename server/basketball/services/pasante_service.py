"""
Servicio para la gestión de Pasantes
"""

import logging
from typing import List, Optional, Dict, Any
from django.core.exceptions import ValidationError
from ..dao.pasante_dao import PasanteDAO
from ..models import Pasante

logger = logging.getLogger(__name__)


class PasanteService:
    """Servicio que encapsula la lógica de negocio para Pasantes"""
    
    def __init__(self):
        self.dao = PasanteDAO()
    
    def create_pasante(self, data: Dict[str, Any]) -> Pasante:
        """
        Crea un nuevo pasante.
        
        Args:
            data: Diccionario con los datos del pasante
            
        Returns:
            Pasante: Instancia creada
            
        Raises:
            ValidationError: Si los datos no son válidos
        """
        persona_external = data.get('persona_external')
        if not persona_external:
            raise ValidationError("El ID externo de la persona es obligatorio")
            
        if self.dao.exists_persona_external(persona_external):
            raise ValidationError(f"Ya existe un pasante con el ID externo {persona_external}")
            
        return self.dao.create(**data)
    
    def update_pasante(self, pk: int, data: Dict[str, Any]) -> Optional[Pasante]:
        """
        Actualiza un pasante existente.
        
        Args:
            pk: ID del pasante
            data: Datos a actualizar
            
        Returns:
            Pasante | None: Instancia actualizada
        """
        if 'persona_external' in data:
            current = self.dao.get_by_id(pk)
            if current and current.persona_external != data['persona_external']:
                if self.dao.exists_persona_external(data['persona_external']):
                    raise ValidationError(f"Ya existe un pasante con el ID externo {data['persona_external']}")
        
        return self.dao.update(pk, **data)
    
    def delete_pasante(self, pk: int) -> bool:
        """
        Elimina (soft delete) un pasante.
        
        Args:
            pk: ID del pasante
            
        Returns:
            bool: True si se eliminó correctamente
        """
        return self.dao.soft_delete(pk)
    
    def get_pasante_by_id(self, pk: int) -> Optional[Pasante]:
        """Obtiene un pasante por ID"""
        return self.dao.get_by_id(pk)
    
    def get_all_pasantes(self) -> List[Pasante]:
        """Obtiene todos los pasantes activos"""
        return list(self.dao.get_activos())
    
    def search_pasantes(self, search_term: str) -> List[Pasante]:
        """Busca pasantes por término"""
        return list(self.dao.search_pasantes(search_term))
