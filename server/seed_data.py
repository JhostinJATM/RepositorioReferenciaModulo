"""
Script para poblar la base de datos con datos de prueba
Ejecutar: python seed_data.py
"""
import os
import sys
import django
from datetime import date, timedelta
from decimal import Decimal

# Configurar Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'basketball_project.settings')
django.setup()

from basketball.models import (
    Administrador, Entrenador, Pasante, GrupoAtleta, Atleta, 
    Inscripcion, PruebaAntropometrica, PruebaFisica,
    TipoInscripcion, TipoPrueba, Sexo
)

def clear_data():
    """Limpiar datos existentes"""
    print("Limpiando datos existentes...")
    PruebaFisica.objects.all().delete()
    PruebaAntropometrica.objects.all().delete()
    Inscripcion.objects.all().delete()
    Atleta.objects.all().delete()
    GrupoAtleta.objects.all().delete()
    Pasante.objects.all().delete()
    Entrenador.objects.all().delete()
    Administrador.objects.all().delete()
    print("✓ Datos limpiados")

def create_administrators():
    """Crear administradores"""
    print("\nCreando administradores...")
    admins = [
        {
            'persona_external': 'admin-001',
            'cargo': 'Director General'
        },
        {
            'persona_external': 'admin-002',
            'cargo': 'Coordinador Administrativo'
        }
    ]
    
    for admin_data in admins:
        admin = Administrador.objects.create(**admin_data)
        print(f"  ✓ Admin creado: {admin.persona_external} - {admin.cargo}")
    
    return Administrador.objects.all()

def create_coaches():
    """Crear entrenadores"""
    print("\nCreando entrenadores...")
    coaches = [
        {
            'persona_external': 'coach-001',
            'especialidad': 'Entrenamiento Físico',
            'club_asignado': 'Club Deportivo Norte'
        },
        {
            'persona_external': 'coach-002',
            'especialidad': 'Técnica y Táctica',
            'club_asignado': 'Club Deportivo Sur'
        },
        {
            'persona_external': 'coach-003',
            'especialidad': 'Preparación Física',
            'club_asignado': 'Club Deportivo Este'
        },
        {
            'persona_external': 'coach-004',
            'especialidad': 'Entrenador de Base',
            'club_asignado': 'Club Deportivo Oeste'
        }
    ]
    
    for coach_data in coaches:
        coach = Entrenador.objects.create(**coach_data)
        print(f"  ✓ Entrenador creado: {coach.persona_external} - {coach.especialidad}")
    
    return Entrenador.objects.all()

def create_interns():
    """Crear pasantes/estudiantes de vinculación"""
    print("\nCreando pasantes...")
    interns = [
        {
            'persona_external': 'intern-001',
            'carrera': 'Cultura Física y Deportes',
            'semestre': '7mo',
            'universidad': 'Universidad Central',
            'fecha_inicio': date.today() - timedelta(days=60),
            'fecha_fin': date.today() + timedelta(days=120)
        },
        {
            'persona_external': 'intern-002',
            'carrera': 'Fisioterapia Deportiva',
            'semestre': '8vo',
            'universidad': 'Universidad del Deporte',
            'fecha_inicio': date.today() - timedelta(days=45),
            'fecha_fin': date.today() + timedelta(days=135)
        },
        {
            'persona_external': 'intern-003',
            'carrera': 'Educación Física',
            'semestre': '6to',
            'universidad': 'Universidad Nacional',
            'fecha_inicio': date.today() - timedelta(days=30),
            'fecha_fin': date.today() + timedelta(days=150)
        },
        {
            'persona_external': 'intern-004',
            'carrera': 'Psicología Deportiva',
            'semestre': '9no',
            'universidad': 'Universidad Politécnica',
            'fecha_inicio': date.today() - timedelta(days=90),
            'fecha_fin': date.today() + timedelta(days=90)
        }
    ]
    
    for intern_data in interns:
        intern = Pasante.objects.create(**intern_data)
        print(f"  ✓ Pasante creado: {intern.persona_external} - {intern.carrera}")
    
    return Pasante.objects.all()

def create_groups(coaches):
    """Crear grupos de atletas"""
    print("\nCreando grupos de atletas...")
    groups_data = [
        {
            'nombre': 'Infantil A',
            'rango_edad_minima': 8,
            'rango_edad_maxima': 10,
            'categoria': 'Infantil',
            'descripcion': 'Grupo de iniciación al baloncesto',
            'entrenador': coaches[0]
        },
        {
            'nombre': 'Infantil B',
            'rango_edad_minima': 11,
            'rango_edad_maxima': 13,
            'categoria': 'Infantil',
            'descripcion': 'Grupo intermedio de formación',
            'entrenador': coaches[1]
        },
        {
            'nombre': 'Juvenil A',
            'rango_edad_minima': 14,
            'rango_edad_maxima': 16,
            'categoria': 'Juvenil',
            'descripcion': 'Grupo de desarrollo técnico',
            'entrenador': coaches[2]
        },
        {
            'nombre': 'Juvenil B',
            'rango_edad_minima': 17,
            'rango_edad_maxima': 19,
            'categoria': 'Juvenil',
            'descripcion': 'Grupo avanzado pre-competitivo',
            'entrenador': coaches[3]
        }
    ]
    
    groups = []
    for group_data in groups_data:
        group = GrupoAtleta.objects.create(**group_data)
        groups.append(group)
        print(f"  ✓ Grupo creado: {group.nombre} - {group.categoria}")
    
    return groups

def create_athletes(groups):
    """Crear atletas"""
    print("\nCreando atletas...")
    
    atletas_data = [
        # Grupo Infantil A
        {'nombre_atleta': 'Juan', 'apellido_atleta': 'Pérez', 'dni': '1234567890', 'fecha_nacimiento': date(2015, 3, 15), 'edad': 10, 'sexo': 'M', 'grupo': groups[0]},
        {'nombre_atleta': 'María', 'apellido_atleta': 'González', 'dni': '1234567891', 'fecha_nacimiento': date(2015, 7, 20), 'edad': 9, 'sexo': 'F', 'grupo': groups[0]},
        {'nombre_atleta': 'Carlos', 'apellido_atleta': 'Rodríguez', 'dni': '1234567892', 'fecha_nacimiento': date(2016, 1, 10), 'edad': 9, 'sexo': 'M', 'grupo': groups[0]},
        
        # Grupo Infantil B
        {'nombre_atleta': 'Ana', 'apellido_atleta': 'Martínez', 'dni': '1234567893', 'fecha_nacimiento': date(2013, 5, 12), 'edad': 12, 'sexo': 'F', 'grupo': groups[1]},
        {'nombre_atleta': 'Luis', 'apellido_atleta': 'Fernández', 'dni': '1234567894', 'fecha_nacimiento': date(2012, 11, 8), 'edad': 13, 'sexo': 'M', 'grupo': groups[1]},
        {'nombre_atleta': 'Sofia', 'apellido_atleta': 'López', 'dni': '1234567895', 'fecha_nacimiento': date(2013, 9, 25), 'edad': 12, 'sexo': 'F', 'grupo': groups[1]},
        
        # Grupo Juvenil A
        {'nombre_atleta': 'Diego', 'apellido_atleta': 'Ramírez', 'dni': '1234567896', 'fecha_nacimiento': date(2010, 2, 14), 'edad': 15, 'sexo': 'M', 'grupo': groups[2]},
        {'nombre_atleta': 'Isabella', 'apellido_atleta': 'Torres', 'dni': '1234567897', 'fecha_nacimiento': date(2009, 8, 30), 'edad': 16, 'sexo': 'F', 'grupo': groups[2]},
        {'nombre_atleta': 'Mateo', 'apellido_atleta': 'Vargas', 'dni': '1234567898', 'fecha_nacimiento': date(2010, 6, 18), 'edad': 15, 'sexo': 'M', 'grupo': groups[2]},
        
        # Grupo Juvenil B
        {'nombre_atleta': 'Valentina', 'apellido_atleta': 'Castro', 'dni': '1234567899', 'fecha_nacimiento': date(2007, 4, 22), 'edad': 18, 'sexo': 'F', 'grupo': groups[3]},
        {'nombre_atleta': 'Santiago', 'apellido_atleta': 'Morales', 'dni': '1234567900', 'fecha_nacimiento': date(2008, 10, 5), 'edad': 17, 'sexo': 'M', 'grupo': groups[3]},
        {'nombre_atleta': 'Camila', 'apellido_atleta': 'Jiménez', 'dni': '1234567901', 'fecha_nacimiento': date(2007, 12, 28), 'edad': 18, 'sexo': 'F', 'grupo': groups[3]},
    ]
    
    atletas = []
    for atleta_data in atletas_data:
        grupo = atleta_data.pop('grupo')
        atleta = Atleta.objects.create(
            email=f"{atleta_data['nombre_atleta'].lower()}.{atleta_data['apellido_atleta'].lower()}@example.com",
            telefono=f"099{atleta_data['dni'][-7:]}",
            tipo_sangre='O+',
            **atleta_data
        )
        atleta.grupos.add(grupo)
        atletas.append(atleta)
        print(f"  ✓ Atleta creado: {atleta.nombre_atleta} {atleta.apellido_atleta} - Grupo: {grupo.nombre}")
    
    return atletas

def create_inscriptions(atletas):
    """Crear inscripciones"""
    print("\nCreando inscripciones...")
    
    tipos = [TipoInscripcion.FEDERADO, TipoInscripcion.NO_FEDERADO, TipoInscripcion.INVITADO]
    
    for i, atleta in enumerate(atletas):
        inscripcion = Inscripcion.objects.create(
            atleta=atleta,
            fecha_inscripcion=date.today() - timedelta(days=30),
            tipo_inscripcion=tipos[i % 3],
            observaciones=f'Inscripción inicial de {atleta.nombre_atleta}',
            registrado_por='admin-001'
        )
        print(f"  ✓ Inscripción creada para: {atleta.nombre_atleta} {atleta.apellido_atleta}")

def create_anthropometric_tests(atletas):
    """Crear pruebas antropométricas"""
    print("\nCreando pruebas antropométricas...")
    
    for atleta in atletas[:8]:  # Solo para algunos atletas
        peso = Decimal(str(30 + atleta.edad * 3.5))
        estatura = Decimal(str(120 + atleta.edad * 5))
        
        prueba = PruebaAntropometrica.objects.create(
            atleta=atleta,
            fecha_registro=date.today() - timedelta(days=15),
            peso=peso,
            estatura=estatura,
            altura_sentado=Decimal(str(float(estatura) * 0.52)),
            envergadura=Decimal(str(float(estatura) * 1.02)),
            porcentaje_grasa=Decimal('15.5'),
            observaciones='Evaluación inicial',
            registrado_por='intern-001'
        )
        print(f"  ✓ Prueba antropométrica para: {atleta.nombre_atleta} {atleta.apellido_atleta}")

def create_physical_tests(atletas):
    """Crear pruebas físicas"""
    print("\nCreando pruebas físicas...")
    
    pruebas_config = [
        {'tipo': TipoPrueba.VELOCIDAD, 'nombre': 'Sprint 20m', 'unidad': 'segundos', 'rango': (3.5, 5.0)},
        {'tipo': TipoPrueba.RESISTENCIA, 'nombre': 'Test Cooper', 'unidad': 'metros', 'rango': (1500, 2500)},
        {'tipo': TipoPrueba.FUERZA, 'nombre': 'Salto Vertical', 'unidad': 'cm', 'rango': (25, 45)},
        {'tipo': TipoPrueba.AGILIDAD, 'nombre': 'Carrera de Conos', 'unidad': 'segundos', 'rango': (12, 18)},
    ]
    
    import random
    
    for atleta in atletas[:6]:  # Solo para algunos atletas
        for config in pruebas_config[:2]:  # 2 pruebas por atleta
            resultado = Decimal(str(random.uniform(config['rango'][0], config['rango'][1])))
            
            prueba = PruebaFisica.objects.create(
                atleta=atleta,
                fecha_registro=date.today() - timedelta(days=10),
                tipo_prueba=config['tipo'],
                nombre_prueba=config['nombre'],
                resultado=resultado,
                unidad_medida=config['unidad'],
                valoracion='Bueno',
                observaciones='Prueba de seguimiento',
                registrado_por='coach-001'
            )
            print(f"  ✓ Prueba física ({config['nombre']}) para: {atleta.nombre_atleta} {atleta.apellido_atleta}")

def main():
    """Función principal"""
    print("="*60)
    print("SCRIPT DE POBLACIÓN DE DATOS - MÓDULO BASKETBALL")
    print("="*60)
    
    # Limpiar datos existentes
    clear_data()
    
    # Crear datos
    admins = create_administrators()
    coaches = create_coaches()
    interns = create_interns()
    groups = create_groups(coaches)
    atletas = create_athletes(groups)
    create_inscriptions(atletas)
    create_anthropometric_tests(atletas)
    create_physical_tests(atletas)
    
    print("\n" + "="*60)
    print("RESUMEN DE DATOS CREADOS")
    print("="*60)
    print(f"  Administradores: {Administrador.objects.count()}")
    print(f"  Entrenadores: {Entrenador.objects.count()}")
    print(f"  Pasantes: {Pasante.objects.count()}")
    print(f"  Grupos: {GrupoAtleta.objects.count()}")
    print(f"  Atletas: {Atleta.objects.count()}")
    print(f"  Inscripciones: {Inscripcion.objects.count()}")
    print(f"  Pruebas Antropométricas: {PruebaAntropometrica.objects.count()}")
    print(f"  Pruebas Físicas: {PruebaFisica.objects.count()}")
    print("="*60)
    print("\n✓ Datos creados exitosamente!")
    print("\nCREDENCIALES DE ACCESO:")
    print("-" * 60)
    print("ADMINISTRADORES:")
    for admin in Administrador.objects.all():
        print(f"  Usuario: {admin.persona_external}")
        print(f"  Password: admin123")
        print(f"  Cargo: {admin.cargo}\n")
    
    print("ENTRENADORES:")
    for coach in Entrenador.objects.all():
        print(f"  Usuario: {coach.persona_external}")
        print(f"  Password: entrenador123")
        print(f"  Especialidad: {coach.especialidad}\n")
    
    print("PASANTES:")
    for intern in Pasante.objects.all():
        print(f"  Usuario: {intern.persona_external}")
        print(f"  Password: pasante123")
        print(f"  Carrera: {intern.carrera}\n")
    print("="*60)

if __name__ == '__main__':
    main()
