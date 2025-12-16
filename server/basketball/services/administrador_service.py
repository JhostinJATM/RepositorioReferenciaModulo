"""
Servicio para la gestión de Administradores
"""

import logging
from typing import List, Optional, Dict, Any
from django.core.exceptions import ValidationError
from ..dao.administrador_dao import AdministradorDAO
from ..models import Administrador

logger = logging.getLogger(__name__)


class AdministradorService:
    """Servicio que encapsula la lógica de negocio para Administradores"""
    
    def __init__(self):
        self.dao = AdministradorDAO()
    
    def create_administrador(self, data: Dict[str, Any]) -> Administrador:
        """
        Crea un nuevo administrador.
        
        Args:
            data: Diccionario con los datos del administrador
            
        Returns:
            Administrador: Instancia creada
            
        Raises:
            ValidationError: Si los datos no son válidos
        """
        persona_external = data.get('persona_external')
        if not persona_external:
            raise ValidationError("persona_external es obligatorio")
            
        if self.dao.exists(persona_external=persona_external):
            raise ValidationError(f"Ya existe un administrador con persona_external {persona_external}")
            
        return self.dao.create(**data)
    
    def update_administrador(self, pk: int, data: Dict[str, Any]) -> Optional[Administrador]:
        """
        Actualiza un administrador existente.
        
        Args:
            pk: ID del administrador
            data: Datos a actualizar
            
        Returns:
            Administrador | None: Instancia actualizada
        """
        return self.dao.update(pk, **data)
    
    def delete_administrador(self, pk: int) -> bool:
        """
        Desactiva un administrador (soft delete).
        
        Args:
            pk: ID del administrador
            
        Returns:
            bool: True si se desactivó correctamente
        """
        administrador = self.dao.update(pk, estado=False)
        return administrador is not None
    
    def get_administrador_by_id(self, pk: int) -> Optional[Administrador]:
        """Obtiene un administrador por ID"""
        return self.dao.get_by_id(pk)
    
    def get_all_administradores(self) -> List[Administrador]:
        """Obtiene todos los administradores activos"""
        return list(self.dao.get_by_filter(estado=True))
    
    def get_by_persona_external(self, persona_external: str) -> Optional[Administrador]:
        """Obtiene administrador por persona_external"""
        return self.dao.get_first(persona_external=persona_external, estado=True)
