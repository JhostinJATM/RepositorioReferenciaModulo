from rest_framework import viewsets, status
from rest_framework.response import Response
from ..services.pasante_service import PasanteService
from ..serializers import PasanteSerializer
from ..permissions import IsAdmin, IsAdminOrEntrenadorOrPasante

class PasanteController(viewsets.ViewSet):
    """
    Controller para Pasantes.
    Admin puede gestionar, otros roles pueden listar.
    """
    service = PasanteService()

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsAdminOrEntrenadorOrPasante()]
        return [IsAdmin()]

    def list(self, request):
        pasantes = self.service.get_all_pasantes()
        serializer = PasanteSerializer(pasantes, many=True)
        return Response(serializer.data)

    def create(self, request):
        try:
            data = request.data.dict() if hasattr(request.data, 'dict') else request.data
            pasante = self.service.create_pasante(data)
            serializer = PasanteSerializer(pasante)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        pasante = self.service.get_pasante_by_id(pk)
        if not pasante:
            return Response({'error': 'Pasante no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        serializer = PasanteSerializer(pasante)
        return Response(serializer.data)

    def update(self, request, pk=None):
        try:
            data = request.data.dict() if hasattr(request.data, 'dict') else request.data
            pasante = self.service.update_pasante(pk, data)
            if not pasante:
                return Response({'error': 'Pasante no encontrado'}, status=status.HTTP_404_NOT_FOUND)
            serializer = PasanteSerializer(pasante)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        success = self.service.delete_pasante(pk)
        if not success:
            return Response({'error': 'Pasante no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)
