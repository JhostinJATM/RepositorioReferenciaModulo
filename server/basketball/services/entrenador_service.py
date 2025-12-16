"""
Servicio para la gestión de Entrenadores
"""

import logging
from typing import List, Optional, Dict, Any
from django.core.exceptions import ValidationError
from ..dao.entrenador_dao import EntrenadorDAO
from ..models import Entrenador

logger = logging.getLogger(__name__)


class EntrenadorService:
    """Servicio que encapsula la lógica de negocio para Entrenadores"""
    
    def __init__(self):
        self.dao = EntrenadorDAO()
    
    def create_entrenador(self, data: Dict[str, Any]) -> Entrenador:
        """
        Crea un nuevo entrenador.
        
        Args:
            data: Diccionario con los datos del entrenador
            
        Returns:
            Entrenador: Instancia creada
            
        Raises:
            ValidationError: Si los datos no son válidos
        """
        persona_external = data.get('persona_external')
        if not persona_external:
            raise ValidationError("El ID externo de la persona es obligatorio")
            
        if self.dao.exists_persona_external(persona_external):
            raise ValidationError(f"Ya existe un entrenador con el ID externo {persona_external}")
            
        return self.dao.create(**data)
    
    def update_entrenador(self, pk: int, data: Dict[str, Any]) -> Optional[Entrenador]:
        """
        Actualiza un entrenador existente.
        
        Args:
            pk: ID del entrenador
            data: Datos a actualizar
            
        Returns:
            Entrenador | None: Instancia actualizada
        """
        # Validar que no se intente duplicar el persona_external si se está cambiando
        if 'persona_external' in data:
            current = self.dao.get_by_id(pk)
            if current and current.persona_external != data['persona_external']:
                if self.dao.exists_persona_external(data['persona_external']):
                    raise ValidationError(f"Ya existe un entrenador con el ID externo {data['persona_external']}")
        
        return self.dao.update(pk, **data)
    
    def delete_entrenador(self, pk: int) -> bool:
        """
        Elimina (soft delete) un entrenador.
        
        Args:
            pk: ID del entrenador
            
        Returns:
            bool: True si se eliminó correctamente
        """
        return self.dao.soft_delete(pk)
    
    def get_entrenador_by_id(self, pk: int) -> Optional[Entrenador]:
        """Obtiene un entrenador por ID"""
        return self.dao.get_by_id(pk)
    
    def get_all_entrenadores(self) -> List[Entrenador]:
        """Obtiene todos los entrenadores activos"""
        return list(self.dao.get_activos())
    
    def search_entrenadores(self, search_term: str) -> List[Entrenador]:
        """Busca entrenadores por término"""
        return list(self.dao.search_entrenadores(search_term))
