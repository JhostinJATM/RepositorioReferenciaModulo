"""
Script para probar todos los endpoints del API Basketball
Detecta errores 4xx y otros problemas
"""

import requests
import json
from datetime import datetime, date

BASE_URL = "http://localhost:8000/api/v1"
LOGIN_URL = "http://localhost:8000/api/auth/login"

class EndpointTester:
    def __init__(self):
        self.token = None
        self.results = []
        self.errors = []
        
    def login(self, username, password):
        """Autenticarse y obtener token"""
        try:
            response = requests.post(LOGIN_URL, json={
                'username': username,
                'password': password
            })
            if response.status_code == 200:
                data = response.json()
                self.token = data.get('token')
                print(f"✓ Login exitoso como {username}")
                return True
            else:
                print(f"✗ Login falló: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            print(f"✗ Error en login: {str(e)}")
            return False
    
    def get_headers(self):
        """Headers con token de autenticación"""
        return {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        }
    
    def test_endpoint(self, method, endpoint, data=None, description=""):
        """Probar un endpoint específico"""
        url = f"{BASE_URL}{endpoint}"
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=self.get_headers())
            elif method == 'POST':
                response = requests.post(url, json=data, headers=self.get_headers())
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=self.get_headers())
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=self.get_headers())
            elif method == 'DELETE':
                response = requests.delete(url, headers=self.get_headers())
            else:
                return
            
            status = response.status_code
            success = 200 <= status < 400
            
            result = {
                'method': method,
                'endpoint': endpoint,
                'description': description,
                'status': status,
                'success': success,
                'response': response.text[:200] if not success else 'OK'
            }
            
            self.results.append(result)
            
            icon = "✓" if success else "✗"
            color = "\033[92m" if success else "\033[91m"
            reset = "\033[0m"
            
            print(f"{color}{icon} {method:6} {endpoint:50} [{status}]{reset}")
            
            if not success:
                self.errors.append(result)
                print(f"  Error: {response.text[:200]}")
            
            return response if success else None
            
        except Exception as e:
            print(f"✗ Exception en {method} {endpoint}: {str(e)}")
            self.errors.append({
                'method': method,
                'endpoint': endpoint,
                'error': str(e)
            })
            return None
    
    def run_all_tests(self):
        """Ejecutar todas las pruebas de endpoints"""
        print("\n" + "="*80)
        print("PROBANDO TODOS LOS ENDPOINTS DEL API BASKETBALL")
        print("="*80 + "\n")
        
        # Login primero
        if not self.login('admin-001', 'admin123'):
            print("No se pudo autenticar. Abortando pruebas.")
            return
        
        print("\n--- ENTRENADORES ---")
        self.test_endpoint('GET', '/entrenadores/', description="Listar entrenadores")
        
        entrenador_response = self.test_endpoint('POST', '/entrenadores/', 
            data={
                'persona_external': 'test-entrenador-001',
                'especialidad': 'Basketball',
                'club_asignado': 'Club Test'
            },
            description="Crear entrenador"
        )
        
        if entrenador_response:
            try:
                entrenador_data = entrenador_response.json()
                entrenador_id = entrenador_data.get('id')
                if entrenador_id:
                    self.test_endpoint('GET', f'/entrenadores/{entrenador_id}/', description="Obtener entrenador por ID")
                    self.test_endpoint('PUT', f'/entrenadores/{entrenador_id}/',
                        data={
                            'persona_external': 'test-entrenador-001',
                            'especialidad': 'Basketball Avanzado',
                            'club_asignado': 'Club Test Updated'
                        },
                        description="Actualizar entrenador"
                    )
            except:
                pass
        
        print("\n--- PASANTES/ESTUDIANTES VINCULACIÓN ---")
        self.test_endpoint('GET', '/pasantes/', description="Listar pasantes")
        
        pasante_response = self.test_endpoint('POST', '/pasantes/',
            data={
                'persona_external': 'test-pasante-001',
                'carrera': 'Educación Física',
                'semestre': '5',
                'universidad': 'Universidad Test',
                'fecha_inicio': str(date.today())
            },
            description="Crear pasante"
        )
        
        if pasante_response:
            try:
                pasante_data = pasante_response.json()
                pasante_id = pasante_data.get('id')
                if pasante_id:
                    self.test_endpoint('GET', f'/pasantes/{pasante_id}/', description="Obtener pasante por ID")
                    self.test_endpoint('PUT', f'/pasantes/{pasante_id}/',
                        data={
                            'persona_external': 'test-pasante-001',
                            'carrera': 'Educación Física',
                            'semestre': '6',
                            'universidad': 'Universidad Test',
                            'fecha_inicio': str(date.today())
                        },
                        description="Actualizar pasante"
                    )
            except:
                pass
        
        print("\n--- ADMINISTRADORES ---")
        self.test_endpoint('GET', '/administradores/', description="Listar administradores")
        
        print("\n--- GRUPOS DE ATLETAS ---")
        self.test_endpoint('GET', '/grupos-atletas/', description="Listar grupos")
        
        # Necesitamos un entrenador existente para crear un grupo
        entrenadores = self.test_endpoint('GET', '/entrenadores/', description="Obtener entrenadores para grupo")
        if entrenadores:
            try:
                entrenadores_data = entrenadores.json()
                if entrenadores_data and len(entrenadores_data) > 0:
                    entrenador_id = entrenadores_data[0]['id']
                    
                    grupo_response = self.test_endpoint('POST', '/grupos-atletas/',
                        data={
                            'nombre': 'Grupo Test',
                            'rango_edad_minima': 10,
                            'rango_edad_maxima': 15,
                            'categoria': 'SUB-15',
                            'entrenador': entrenador_id
                        },
                        description="Crear grupo"
                    )
                    
                    if grupo_response:
                        try:
                            grupo_data = grupo_response.json()
                            grupo_id = grupo_data.get('id')
                            if grupo_id:
                                self.test_endpoint('GET', f'/grupos-atletas/{grupo_id}/', description="Obtener grupo por ID")
                        except:
                            pass
            except:
                pass
        
        print("\n--- ATLETAS ---")
        self.test_endpoint('GET', '/atletas/', description="Listar atletas")
        
        atleta_response = self.test_endpoint('POST', '/atletas/',
            data={
                'nombre_atleta': 'Test',
                'apellido_atleta': 'Atleta',
                'dni': '9999999999',
                'fecha_nacimiento': '2010-01-01',
                'edad': 14,
                'sexo': 'M',
                'email': 'test@test.com',
                'telefono': '0999999999'
            },
            description="Crear atleta"
        )
        
        if atleta_response:
            try:
                atleta_data = atleta_response.json()
                atleta_id = atleta_data.get('id')
                if atleta_id:
                    self.test_endpoint('GET', f'/atletas/{atleta_id}/', description="Obtener atleta por ID")
                    
                    print("\n--- INSCRIPCIONES ---")
                    self.test_endpoint('GET', '/inscripciones/', description="Listar inscripciones")
                    
                    inscripcion_response = self.test_endpoint('POST', '/inscripciones/',
                        data={
                            'atleta': atleta_id,
                            'fecha_inscripcion': str(date.today()),
                            'tipo_inscripcion': 'FEDERADO'
                        },
                        description="Crear inscripción"
                    )
                    
                    print("\n--- PRUEBAS ANTROPOMÉTRICAS ---")
                    self.test_endpoint('GET', '/pruebas-antropometricas/', description="Listar pruebas antropométricas")
                    
                    prueba_antro_response = self.test_endpoint('POST', '/pruebas-antropometricas/',
                        data={
                            'atleta': atleta_id,
                            'fecha_registro': str(date.today()),
                            'peso': 50.5,
                            'estatura': 165.0,
                            'indice_masa_corporal': 18.5
                        },
                        description="Crear prueba antropométrica"
                    )
                    
                    print("\n--- PRUEBAS FÍSICAS ---")
                    self.test_endpoint('GET', '/pruebas-fisicas/', description="Listar pruebas físicas")
                    
                    prueba_fisica_response = self.test_endpoint('POST', '/pruebas-fisicas/',
                        data={
                            'atleta': atleta_id,
                            'fecha_registro': str(date.today()),
                            'tipo_prueba': 'VELOCIDAD',
                            'nombre_prueba': 'Carrera 50m',
                            'resultado': 7.5,
                            'unidad_medida': 'segundos'
                        },
                        description="Crear prueba física"
                    )
            except Exception as e:
                print(f"Error procesando atleta: {str(e)}")
        
        # Resumen
        print("\n" + "="*80)
        print("RESUMEN DE PRUEBAS")
        print("="*80)
        
        total = len(self.results)
        exitosos = sum(1 for r in self.results if r['success'])
        fallidos = total - exitosos
        
        print(f"\nTotal de pruebas: {total}")
        print(f"✓ Exitosos: {exitosos}")
        print(f"✗ Fallidos: {fallidos}")
        
        if self.errors:
            print("\n--- ERRORES DETECTADOS ---")
            for error in self.errors:
                print(f"\n✗ {error['method']} {error['endpoint']}")
                print(f"  Status: {error.get('status', 'N/A')}")
                print(f"  Response: {error.get('response', error.get('error', 'N/A'))}")
        
        print("\n" + "="*80 + "\n")

if __name__ == '__main__':
    tester = EndpointTester()
    tester.run_all_tests()
