"""
Servicio para la gestión de Grupos de Atletas
"""

import logging
from typing import List, Optional, Dict, Any
from django.core.exceptions import ValidationError
from ..dao.grupo_atleta_dao import GrupoAtletaDAO
from ..models import GrupoAtleta

logger = logging.getLogger(__name__)


class GrupoAtletaService:
    """Servicio que encapsula la lógica de negocio para Grupos de Atletas"""
    
    def __init__(self):
        self.dao = GrupoAtletaDAO()
    
    def create_grupo(self, data: Dict[str, Any]) -> GrupoAtleta:
        """
        Crea un nuevo grupo.
        
        Args:
            data: Diccionario con los datos del grupo
            
        Returns:
            GrupoAtleta: Instancia creada
            
        Raises:
            ValidationError: Si los datos no son válidos
        """
        rango_min = data.get('rango_edad_minima')
        rango_max = data.get('rango_edad_maxima')
        
        if rango_min is not None:
            try:
                rango_min = int(rango_min)
                data['rango_edad_minima'] = rango_min
            except (ValueError, TypeError):
                pass

        if rango_max is not None:
            try:
                rango_max = int(rango_max)
                data['rango_edad_maxima'] = rango_max
            except (ValueError, TypeError):
                pass
        
        if rango_min is not None and rango_max is not None:
            if not self.dao.validate_rango_edad(rango_min, rango_max):
                raise ValidationError("El rango de edad no es válido (min >= 0 y max > min)")
        
        if 'entrenador' in data:
            val = data['entrenador']
            if isinstance(val, (int, str)):
                data['entrenador_id'] = data.pop('entrenador')
        
        return self.dao.create(**data)
    
    def update_grupo(self, pk: int, data: Dict[str, Any]) -> Optional[GrupoAtleta]:
        """
        Actualiza un grupo existente.
        
        Args:
            pk: ID del grupo
            data: Datos a actualizar
            
        Returns:
            GrupoAtleta | None: Instancia actualizada
        """
        # Validar rango si se actualizan ambos o uno de ellos
        current = self.dao.get_by_id(pk)
        if not current:
            return None
            
        rango_min = data.get('rango_edad_minima', current.rango_edad_minima)
        rango_max = data.get('rango_edad_maxima', current.rango_edad_maxima)
        
        if rango_min is not None:
            try:
                rango_min = int(rango_min)
                if 'rango_edad_minima' in data:
                    data['rango_edad_minima'] = rango_min
            except (ValueError, TypeError):
                pass

        if rango_max is not None:
            try:
                rango_max = int(rango_max)
                if 'rango_edad_maxima' in data:
                    data['rango_edad_maxima'] = rango_max
            except (ValueError, TypeError):
                pass
        
        if not self.dao.validate_rango_edad(rango_min, rango_max):
            raise ValidationError("El rango de edad no es válido (min >= 0 y max > min)")
            
        if 'entrenador' in data:
            val = data['entrenador']
            if isinstance(val, (int, str)):
                data['entrenador_id'] = data.pop('entrenador')

        return self.dao.update(pk, **data)
    
    def delete_grupo(self, pk: int) -> bool:
        """
        Elimina (soft delete) un grupo.
        
        Args:
            pk: ID del grupo
            
        Returns:
            bool: True si se eliminó correctamente
        """
        return self.dao.soft_delete(pk)
    
    def get_grupo_by_id(self, pk: int) -> Optional[GrupoAtleta]:
        """Obtiene un grupo por ID"""
        return self.dao.get_by_id(pk)
    
    def get_all_grupos(self) -> List[GrupoAtleta]:
        """Obtiene todos los grupos activos"""
        return list(self.dao.get_activos())
    
    def get_grupos_by_entrenador(self, entrenador_id: int) -> List[GrupoAtleta]:
        """Obtiene grupos de un entrenador"""
        return list(self.dao.get_by_entrenador(entrenador_id))
    
    def search_grupos(self, search_term: str) -> List[GrupoAtleta]:
        """Busca grupos por término"""
        return list(self.dao.search_grupos(search_term))
