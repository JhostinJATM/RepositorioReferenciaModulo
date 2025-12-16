from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from ..services.atleta_service import AtletaService
from ..serializers import AtletaSerializer
from ..permissions import IsAdminOrEntrenadorOrPasante

class AtletaController(viewsets.ViewSet):
    """
    Controller para Atletas.
    Acceso para Admin, Entrenador y Pasante.
    """
    permission_classes = [IsAdminOrEntrenadorOrPasante]
    service = AtletaService()

    def list(self, request):
        atletas = self.service.get_all_atletas()
        serializer = AtletaSerializer(atletas, many=True)
        return Response(serializer.data)

    def create(self, request):
        try:
            data = request.data.dict() if hasattr(request.data, 'dict') else request.data
            atleta = self.service.create_atleta(data)
            serializer = AtletaSerializer(atleta)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        atleta = self.service.get_atleta_by_id(pk)
        if not atleta:
            return Response({'error': 'Atleta no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        serializer = AtletaSerializer(atleta)
        return Response(serializer.data)

    def update(self, request, pk=None):
        try:
            data = request.data.dict() if hasattr(request.data, 'dict') else request.data
            atleta = self.service.update_atleta(pk, data)
            if not atleta:
                return Response({'error': 'Atleta no encontrado'}, status=status.HTTP_404_NOT_FOUND)
            serializer = AtletaSerializer(atleta)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        success = self.service.delete_atleta(pk)
        if not success:
            return Response({'error': 'Atleta no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=True, methods=['post'])
    def asignar_grupo(self, request, pk=None):
        grupo_id = request.data.get('grupo_id')
        if not grupo_id:
            return Response({'error': 'grupo_id es requerido'}, status=status.HTTP_400_BAD_REQUEST)
        
        success = self.service.asignar_grupo(pk, grupo_id)
        if success:
            return Response({'status': 'Grupo asignado correctamente'})
        return Response({'error': 'No se pudo asignar el grupo'}, status=status.HTTP_400_BAD_REQUEST)
