"""
Modelos del módulo Basketball - ORM Django

Basado en el diagrama de clases proporcionado.
NOTA: La clase Usuario/Persona pertenece a otro módulo externo (user_module).
Se usa persona_external como referencia externa (UUID) en lugar de herencia.
"""

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal


class TipoInscripcion(models.TextChoices):
    """Enum para tipos de inscripción"""
    FEDERADO = 'FEDERADO', 'Federado'
    NO_FEDERADO = 'NO_FEDERADO', 'No Federado'
    INVITADO = 'INVITADO', 'Invitado'


class TipoPrueba(models.TextChoices):
    """Enum para tipos de prueba física"""
    VELOCIDAD = 'VELOCIDAD', 'Velocidad'
    RESISTENCIA = 'RESISTENCIA', 'Resistencia'
    FUERZA = 'FUERZA', 'Fuerza'
    FLEXIBILIDAD = 'FLEXIBILIDAD', 'Flexibilidad'
    COORDINACION = 'COORDINACION', 'Coordinación'
    AGILIDAD = 'AGILIDAD', 'Agilidad'


class Sexo(models.TextChoices):
    """Enum para sexo"""
    MASCULINO = 'M', 'Masculino'
    FEMENINO = 'F', 'Femenino'
    OTRO = 'O', 'Otro'


class TipoRol(models.TextChoices):
    """Enum para tipos de rol en el sistema basketball"""
    ADMIN = 'ADMIN', 'Administrador'
    ENTRENADOR = 'ENTRENADOR', 'Entrenador'
    PASANTE = 'PASANTE', 'Pasante/Estudiante de Vinculación'


# =============================================================================
# Modelo Entrenador (referencia externa a Persona del módulo de usuarios)
# =============================================================================
class Entrenador(models.Model):
    """
    Modelo para Entrenadores.
    Referencia externa al módulo de usuarios mediante persona_external (UUID).
    """
    persona_external = models.CharField(
        max_length=100, 
        unique=True, 
        verbose_name='External ID Persona',
        help_text='UUID externo de la persona en el módulo de usuarios'
    )
    especialidad = models.CharField(max_length=100, verbose_name='Especialidad')
    club_asignado = models.CharField(max_length=100, verbose_name='Club asignado')
    fecha_registro = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de registro')
    estado = models.BooleanField(default=True, verbose_name='Estado')

    class Meta:
        db_table = 'entrenador'
        verbose_name = 'Entrenador'
        verbose_name_plural = 'Entrenadores'
        ordering = ['-fecha_registro']

    def __str__(self):
        return f"Entrenador: {self.persona_external} - {self.especialidad}"


# =============================================================================
# Modelo Pasante/EstudianteVinculacion (referencia externa a Persona)
# =============================================================================
class Pasante(models.Model):
    """
    Modelo para Pasantes/Estudiantes de Vinculación.
    Referencia externa al módulo de usuarios mediante persona_external (UUID).
    """
    persona_external = models.CharField(
        max_length=100, 
        unique=True, 
        verbose_name='External ID Persona',
        help_text='UUID externo de la persona en el módulo de usuarios'
    )
    carrera = models.CharField(max_length=100, verbose_name='Carrera')
    semestre = models.CharField(max_length=20, verbose_name='Semestre')
    universidad = models.CharField(max_length=150, blank=True, null=True, verbose_name='Universidad')
    fecha_inicio = models.DateField(verbose_name='Fecha de inicio de vinculación')
    fecha_fin = models.DateField(blank=True, null=True, verbose_name='Fecha de fin de vinculación')
    fecha_registro = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de registro')
    estado = models.BooleanField(default=True, verbose_name='Estado')

    class Meta:
        db_table = 'pasante'
        verbose_name = 'Pasante'
        verbose_name_plural = 'Pasantes'
        ordering = ['-fecha_registro']

    def __str__(self):
        return f"Pasante: {self.persona_external} - {self.carrera}"


# =============================================================================
# Modelo Administrador (referencia externa a Persona)
# =============================================================================
class Administrador(models.Model):
    """
    Modelo para Administradores del sistema.
    Referencia externa al módulo de usuarios mediante persona_external (UUID).
    """
    persona_external = models.CharField(
        max_length=100, 
        unique=True, 
        verbose_name='External ID Persona',
        help_text='UUID externo de la persona en el módulo de usuarios'
    )
    cargo = models.CharField(max_length=100, blank=True, null=True, verbose_name='Cargo')
    fecha_registro = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de registro')
    estado = models.BooleanField(default=True, verbose_name='Estado')

    class Meta:
        db_table = 'administrador'
        verbose_name = 'Administrador'
        verbose_name_plural = 'Administradores'
        ordering = ['-fecha_registro']

    def __str__(self):
        return f"Administrador: {self.persona_external}"


# =============================================================================
# Modelo GrupoAtleta
# =============================================================================
class GrupoAtleta(models.Model):
    """Modelo para grupos de atletas"""
    nombre = models.CharField(max_length=100, verbose_name='Nombre')
    rango_edad_minima = models.IntegerField(
        validators=[MinValueValidator(0)],
        verbose_name='Rango edad mínima'
    )
    rango_edad_maxima = models.IntegerField(
        validators=[MinValueValidator(0)],
        verbose_name='Rango edad máxima'
    )
    categoria = models.CharField(max_length=50, verbose_name='Categoría')
    descripcion = models.TextField(blank=True, null=True, verbose_name='Descripción')
    fecha_creacion = models.DateField(auto_now_add=True, verbose_name='Fecha de creación')
    estado = models.BooleanField(default=True, verbose_name='Estado')
    
    # Relación con Entrenador - Un entrenador puede tener múltiples grupos
    entrenador = models.ForeignKey(
        Entrenador,
        on_delete=models.PROTECT,
        related_name='grupos',
        verbose_name='Entrenador'
    )

    class Meta:
        db_table = 'grupo_atleta'
        verbose_name = 'Grupo de Atleta'
        verbose_name_plural = 'Grupos de Atletas'
        ordering = ['nombre']

    def __str__(self):
        return f"{self.nombre} - {self.categoria}"


# =============================================================================
# Modelo Atleta
# =============================================================================
class Atleta(models.Model):
    """Modelo para Atletas"""
    nombre_atleta = models.CharField(max_length=100, verbose_name='Nombre')
    apellido_atleta = models.CharField(max_length=100, verbose_name='Apellido')
    dni = models.CharField(max_length=20, unique=True, verbose_name='DNI')
    fecha_nacimiento = models.DateField(verbose_name='Fecha de nacimiento')
    edad = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        verbose_name='Edad'
    )
    sexo = models.CharField(
        max_length=1,
        choices=Sexo.choices,
        verbose_name='Sexo'
    )
    email = models.EmailField(blank=True, null=True, verbose_name='Email')
    telefono = models.CharField(max_length=20, blank=True, null=True, verbose_name='Teléfono')
    tipo_sangre = models.CharField(max_length=10, blank=True, null=True, verbose_name='Tipo de sangre')
    datos_representante = models.TextField(blank=True, null=True, verbose_name='Datos del representante')
    telefono_representante = models.CharField(max_length=20, blank=True, null=True, verbose_name='Teléfono representante')
    foto = models.CharField(max_length=255, blank=True, null=True, verbose_name='Foto')
    fecha_registro = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de registro')
    estado = models.BooleanField(default=True, verbose_name='Estado')
    
    # Relación con GrupoAtleta - ManyToMany
    grupos = models.ManyToManyField(
        GrupoAtleta,
        related_name='atletas',
        blank=True,
        verbose_name='Grupos'
    )

    class Meta:
        db_table = 'atleta'
        verbose_name = 'Atleta'
        verbose_name_plural = 'Atletas'
        ordering = ['apellido_atleta', 'nombre_atleta']

    def __str__(self):
        return f"{self.nombre_atleta} {self.apellido_atleta}"


# =============================================================================
# Modelo Inscripcion
# =============================================================================
class Inscripcion(models.Model):
    """Modelo para Inscripciones"""
    atleta = models.OneToOneField(
        Atleta,
        on_delete=models.CASCADE,
        related_name='inscripcion',
        verbose_name='Atleta'
    )
    fecha_inscripcion = models.DateField(verbose_name='Fecha de inscripción')
    tipo_inscripcion = models.CharField(
        max_length=20,
        choices=TipoInscripcion.choices,
        verbose_name='Tipo de inscripción'
    )
    observaciones = models.TextField(blank=True, null=True, verbose_name='Observaciones')
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')
    fecha_actualizacion = models.DateTimeField(auto_now=True, verbose_name='Fecha de actualización')
    habilitada = models.BooleanField(default=True, verbose_name='Habilitada')
    
    # Referencia a quien registró la inscripción
    registrado_por = models.CharField(
        max_length=100, 
        blank=True, 
        null=True, 
        verbose_name='Registrado por (External ID)'
    )

    class Meta:
        db_table = 'inscripcion'
        verbose_name = 'Inscripción'
        verbose_name_plural = 'Inscripciones'
        ordering = ['-fecha_inscripcion']

    def __str__(self):
        return f"Inscripción {self.id} - {self.atleta}"


# =============================================================================
# Modelo PruebaAntropometrica
# =============================================================================
class PruebaAntropometrica(models.Model):
    """Modelo para Pruebas Antropométricas"""
    atleta = models.ForeignKey(
        Atleta,
        on_delete=models.CASCADE,
        related_name='pruebas_antropometricas',
        verbose_name='Atleta'
    )
    fecha_registro = models.DateField(verbose_name='Fecha de registro')
    peso = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        verbose_name='Peso (kg)'
    )
    estatura = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        verbose_name='Estatura (cm)'
    )
    indice_masa_corporal = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        blank=True,
        null=True,
        verbose_name='Índice de masa corporal'
    )
    altura_sentado = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        blank=True,
        null=True,
        verbose_name='Altura sentado (cm)'
    )
    envergadura = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        blank=True,
        null=True,
        verbose_name='Envergadura (cm)'
    )
    indice_cornico = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=True,
        null=True,
        verbose_name='Índice córnico'
    )
    porcentaje_grasa = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        blank=True,
        null=True,
        verbose_name='Porcentaje de grasa corporal'
    )
    observaciones = models.TextField(blank=True, null=True, verbose_name='Observaciones')
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')
    estado = models.BooleanField(default=True, verbose_name='Estado')
    
    # Referencia a quien registró la prueba
    registrado_por = models.CharField(
        max_length=100, 
        blank=True, 
        null=True, 
        verbose_name='Registrado por (External ID)'
    )

    class Meta:
        db_table = 'prueba_antropometrica'
        verbose_name = 'Prueba Antropométrica'
        verbose_name_plural = 'Pruebas Antropométricas'
        ordering = ['-fecha_registro']

    def __str__(self):
        return f"Prueba Antropométrica {self.id} - {self.atleta}"
    
    def save(self, *args, **kwargs):
        """Calcula automáticamente el IMC si no se proporciona"""
        if self.peso and self.estatura and not self.indice_masa_corporal:
            # IMC = peso(kg) / estatura(m)²
            estatura_metros = self.estatura / 100
            self.indice_masa_corporal = self.peso / (estatura_metros ** 2)
        super().save(*args, **kwargs)


# =============================================================================
# Modelo PruebaFisica
# =============================================================================
class PruebaFisica(models.Model):
    """Modelo para Pruebas Físicas"""
    atleta = models.ForeignKey(
        Atleta,
        on_delete=models.CASCADE,
        related_name='pruebas_fisicas',
        verbose_name='Atleta'
    )
    fecha_registro = models.DateField(verbose_name='Fecha de registro')
    tipo_prueba = models.CharField(
        max_length=20,
        choices=TipoPrueba.choices,
        verbose_name='Tipo de prueba'
    )
    nombre_prueba = models.CharField(max_length=100, verbose_name='Nombre de la prueba')
    resultado = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name='Resultado'
    )
    unidad_medida = models.CharField(max_length=20, verbose_name='Unidad de medida')
    valoracion = models.CharField(
        max_length=50, 
        blank=True, 
        null=True, 
        verbose_name='Valoración',
        help_text='Ej: Excelente, Bueno, Regular, Deficiente'
    )
    observaciones = models.TextField(blank=True, null=True, verbose_name='Observaciones')
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')
    estado = models.BooleanField(default=True, verbose_name='Estado')
    
    # Referencia a quien registró la prueba
    registrado_por = models.CharField(
        max_length=100, 
        blank=True, 
        null=True, 
        verbose_name='Registrado por (External ID)'
    )

    class Meta:
        db_table = 'prueba_fisica'
        verbose_name = 'Prueba Física'
        verbose_name_plural = 'Pruebas Físicas'
        ordering = ['-fecha_registro']

    def __str__(self):
        return f"Prueba Física {self.id} - {self.atleta} - {self.tipo_prueba}"
