from rest_framework import viewsets, status
from rest_framework.response import Response
from ..services.grupo_atleta_service import GrupoAtletaService
from ..serializers import GrupoAtletaSerializer
from ..permissions import IsAdmin, IsAdminOrEntrenadorOrPasante

class GrupoAtletaController(viewsets.ViewSet):
    """
    Controller para Grupos de Atletas.
    Admin y Entrenador pueden gestionar grupos, todos pueden ver.
    """
    service = GrupoAtletaService()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAdminOrEntrenadorOrPasante()]
        return [IsAdmin()]

    def list(self, request):
        grupos = self.service.get_all_grupos()
        serializer = GrupoAtletaSerializer(grupos, many=True)
        return Response(serializer.data)

    def create(self, request):
        try:
            data = request.data.dict() if hasattr(request.data, 'dict') else request.data
            grupo = self.service.create_grupo(data)
            serializer = GrupoAtletaSerializer(grupo)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        grupo = self.service.get_grupo_by_id(pk)
        if not grupo:
            return Response({'error': 'Grupo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        serializer = GrupoAtletaSerializer(grupo)
        return Response(serializer.data)

    def update(self, request, pk=None):
        try:
            data = request.data.dict() if hasattr(request.data, 'dict') else request.data
            grupo = self.service.update_grupo(pk, data)
            if not grupo:
                return Response({'error': 'Grupo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
            serializer = GrupoAtletaSerializer(grupo)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        success = self.service.delete_grupo(pk)
        if not success:
            return Response({'error': 'Grupo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)
