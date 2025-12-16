from rest_framework import viewsets, status
from rest_framework.response import Response
from ..services.inscripcion_service import InscripcionService
from ..serializers import InscripcionSerializer
from ..permissions import IsAdminOrEntrenadorOrPasante

class InscripcionController(viewsets.ViewSet):
    """
    Controller para Inscripciones.
    Acceso para Admin, Entrenador y Pasante.
    """
    permission_classes = [IsAdminOrEntrenadorOrPasante]
    service = InscripcionService()

    def list(self, request):
        inscripciones = self.service.get_all_inscripciones()
        serializer = InscripcionSerializer(inscripciones, many=True)
        return Response(serializer.data)

    def create(self, request):
        try:
            data = request.data.dict() if hasattr(request.data, 'dict') else request.data
            # Normalizar atleta_id si viene como 'atleta'
            if 'atleta' in data and 'atleta_id' not in data:
                data['atleta_id'] = data.pop('atleta')
            inscripcion = self.service.create_inscripcion(data)
            serializer = InscripcionSerializer(inscripcion)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        inscripcion = self.service.get_inscripcion_by_id(pk)
        if not inscripcion:
            return Response({'error': 'Inscripción no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        serializer = InscripcionSerializer(inscripcion)
        return Response(serializer.data)

    def update(self, request, pk=None):
        try:
            data = request.data.dict() if hasattr(request.data, 'dict') else request.data
            # Normalizar atleta_id si viene como 'atleta'
            if 'atleta' in data and 'atleta_id' not in data:
                data['atleta_id'] = data.pop('atleta')
            inscripcion = self.service.update_inscripcion(pk, data)
            if not inscripcion:
                return Response({'error': 'Inscripción no encontrada'}, status=status.HTTP_404_NOT_FOUND)
            serializer = InscripcionSerializer(inscripcion)
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        success = self.service.delete_inscripcion(pk)
        if not success:
            return Response({'error': 'Inscripción no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)
