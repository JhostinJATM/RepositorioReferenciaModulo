from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..services.entrenador_service import EntrenadorService
from ..serializers import EntrenadorSerializer
from ..permissions import IsAdmin, IsAdminOrEntrenadorOrPasante

class EntrenadorController(viewsets.ViewSet):
    """
    Controller para Entrenadores.
    Admin puede gestionar, otros roles pueden listar.
    """
    service = EntrenadorService()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAdminOrEntrenadorOrPasante()]
        return [IsAdmin()]

    def list(self, request):
        entrenadores = self.service.get_all_entrenadores()
        serializer = EntrenadorSerializer(entrenadores, many=True)
        return Response(serializer.data)

    def create(self, request):
        try:
            data = request.data.dict() if hasattr(request.data, 'dict') else request.data
            entrenador = self.service.create_entrenador(data)
            serializer = EntrenadorSerializer(entrenador)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        entrenador = self.service.get_entrenador_by_id(pk)
        if not entrenador:
            return Response({'error': 'Entrenador no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        serializer = EntrenadorSerializer(entrenador)
        return Response(serializer.data)

    def update(self, request, pk=None):
        try:
            data = request.data.dict() if hasattr(request.data, 'dict') else request.data
            entrenador = self.service.update_entrenador(pk, data)
            if not entrenador:
                return Response({'error': 'Entrenador no encontrado'}, status=status.HTTP_404_NOT_FOUND)
            serializer = EntrenadorSerializer(entrenador)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        success = self.service.delete_entrenador(pk)
        if not success:
            return Response({'error': 'Entrenador no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)
