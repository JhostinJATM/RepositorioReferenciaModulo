from rest_framework import viewsets, status
from rest_framework.response import Response
from ..services.prueba_antropometrica_service import PruebaAntropometricaService
from ..serializers import PruebaAntropometricaSerializer
from ..permissions import IsAdminOrEntrenadorOrPasante

class PruebaAntropometricaController(viewsets.ViewSet):
    """
    Controller para Pruebas Antropométricas.
    Acceso para Admin, Entrenador y Pasante.
    """
    permission_classes = [IsAdminOrEntrenadorOrPasante]
    service = PruebaAntropometricaService()

    def list(self, request):
        pruebas = self.service.get_all_pruebas()
        serializer = PruebaAntropometricaSerializer(pruebas, many=True)
        return Response(serializer.data)

    def create(self, request):
        try:
            data = request.data.dict() if hasattr(request.data, 'dict') else request.data
            # Normalizar atleta_id si viene como 'atleta'
            if 'atleta' in data and 'atleta_id' not in data:
                data['atleta_id'] = data.pop('atleta')
            prueba = self.service.create_prueba(data)
            serializer = PruebaAntropometricaSerializer(prueba)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        prueba = self.service.get_prueba_by_id(pk)
        if not prueba:
            return Response({'error': 'Prueba no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        serializer = PruebaAntropometricaSerializer(prueba)
        return Response(serializer.data)

    def update(self, request, pk=None):
        try:
            data = request.data.dict() if hasattr(request.data, 'dict') else request.data
            # Normalizar atleta_id si viene como 'atleta'
            if 'atleta' in data and 'atleta_id' not in data:
                data['atleta_id'] = data.pop('atleta')
            prueba = self.service.update_prueba(pk, data)
            if not prueba:
                return Response({'error': 'Prueba no encontrada'}, status=status.HTTP_404_NOT_FOUND)
            serializer = PruebaAntropometricaSerializer(prueba)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        success = self.service.delete_prueba(pk)
        if not success:
            return Response({'error': 'Prueba no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)
