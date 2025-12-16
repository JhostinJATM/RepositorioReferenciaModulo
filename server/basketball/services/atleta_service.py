"""
Servicio para la gestión de Atletas
"""

import logging
from typing import List, Optional, Dict, Any
from django.core.exceptions import ValidationError
from ..dao.atleta_dao import AtletaDAO
from ..models import Atleta

logger = logging.getLogger(__name__)


class AtletaService:
    """Servicio que encapsula la lógica de negocio para Atletas"""
    
    def __init__(self):
        self.dao = AtletaDAO()
    
    def create_atleta(self, data: Dict[str, Any]) -> Atleta:
        """
        Crea un nuevo atleta.
        
        Args:
            data: Diccionario con los datos del atleta
            
        Returns:
            Atleta: Instancia creada
            
        Raises:
            ValidationError: Si los datos no son válidos
        """
        dni = data.get('dni')
        if not dni:
            raise ValidationError("El DNI es obligatorio")
            
        if self.dao.exists_dni(dni):
            raise ValidationError(f"Ya existe un atleta con el DNI {dni}")
            
        return self.dao.create(**data)
    
    def update_atleta(self, pk: int, data: Dict[str, Any]) -> Optional[Atleta]:
        """
        Actualiza un atleta existente.
        
        Args:
            pk: ID del atleta
            data: Datos a actualizar
            
        Returns:
            Atleta | None: Instancia actualizada
        """
        if 'dni' in data:
            if self.dao.exists_dni(data['dni'], exclude_id=pk):
                raise ValidationError(f"Ya existe otro atleta con el DNI {data['dni']}")
        
        return self.dao.update(pk, **data)
    
    def delete_atleta(self, pk: int) -> bool:
        """
        Elimina (soft delete) un atleta.
        
        Args:
            pk: ID del atleta
            
        Returns:
            bool: True si se eliminó correctamente
        """
        return self.dao.soft_delete(pk)
    
    def get_atleta_by_id(self, pk: int) -> Optional[Atleta]:
        """Obtiene un atleta por ID"""
        return self.dao.get_by_id(pk)
    
    def get_all_atletas(self) -> List[Atleta]:
        """Obtiene todos los atletas activos"""
        return list(self.dao.get_activos())
    
    def search_atletas(self, search_term: str) -> List[Atleta]:
        """Busca atletas por término"""
        return list(self.dao.search_atletas(search_term))
    
    def asignar_grupo(self, atleta_id: int, grupo_id: int) -> bool:
        """Asigna un atleta a un grupo"""
        return self.dao.asignar_grupo(atleta_id, grupo_id)
    
    def remover_grupo(self, atleta_id: int, grupo_id: int) -> bool:
        """Remueve un atleta de un grupo"""
        return self.dao.remover_grupo(atleta_id, grupo_id)
